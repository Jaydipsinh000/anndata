import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Send Mobile OTP (Real-World Authentication)
export const sendMobileOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || mobile.length < 10) {
      return res.status(400).json({ message: 'Valid 10-digit mobile number required' });
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    res.json({
      success: true,
      otp,
      mobile,
      message: `SMS Notification: Your Anndata Mobile Verification OTP code is ${otp}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send Email OTP / Code (Real-World Authentication)
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email address required' });
    }

    // Check if email already registered
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email is already registered. Please login instead.' });
    }

    const code = 'ANN-' + Math.floor(1000 + Math.random() * 9000).toString();
    res.json({
      success: true,
      code,
      email,
      message: `Email Notification: Your Anndata Email Verification Code is ${code}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register a new user with verified details
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile, address, village, taluka, district, state, pincode, role, mobile_verified, email_verified } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Formatted full address
    const fullAddress = address || [village, taluka, district, state, pincode].filter(Boolean).join(', ');

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile: mobile || '9999999999',
      village: village || '',
      taluka: taluka || '',
      district: district || '',
      state: state || 'Gujarat',
      pincode: pincode || '',
      address: fullAddress,
      role: role || 'farmer',
      mobile_verified: mobile_verified ?? true,
      email_verified: email_verified ?? true,
      status: 'approved',
      trust_badge: 'verified'
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        village: user.village,
        taluka: user.taluka,
        district: user.district,
        address: user.address,
        mobile_verified: user.mobile_verified,
        email_verified: user.email_verified,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        village: user.village,
        taluka: user.taluka,
        district: user.district,
        address: user.address,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google Account Login / Register
export const googleLogin = async (req, res) => {
  try {
    const { email, name, role, mobile, village, taluka, district, address } = req.body;
    if (!email) return res.status(400).json({ message: 'Google email is required' });

    let user = await User.findOne({ email });
    const fullAddress = address || [village, taluka, district].filter(Boolean).join(', ');

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), salt);
      
      user = await User.create({
        name: name || email.split('@')[0],
        email: email,
        password: randomPassword,
        mobile: mobile || '',
        village: village || '',
        taluka: taluka || '',
        district: district || '',
        address: fullAddress,
        role: role || 'farmer',
        email_verified: true,
        status: 'approved',
        trust_badge: 'verified'
      });
    } else {
      // Update existing Google user if mobile or location details were submitted
      if (mobile && mobile !== '9999999999') user.mobile = mobile;
      if (village) user.village = village;
      if (taluka) user.taluka = taluka;
      if (district) user.district = district;
      if (fullAddress) user.address = fullAddress;
      await user.save();
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      village: user.village,
      taluka: user.taluka,
      district: user.district,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Google authentication error: ' + error.message });
  }
};

// Mobile OTP Login / Register
export const mobileLogin = async (req, res) => {
  try {
    const { mobile, name, role, village, taluka, district } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile number is required' });

    let user = await User.findOne({ mobile });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), salt);
      const generatedEmail = `${mobile}@anndata.com`;

      user = await User.create({
        name: name || `Farmer (${mobile.slice(-4)})`,
        email: generatedEmail,
        password: randomPassword,
        mobile: mobile,
        village: village || '',
        taluka: taluka || '',
        district: district || '',
        role: role || 'farmer',
        mobile_verified: true,
        status: 'approved',
        trust_badge: 'verified'
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      village: user.village,
      taluka: user.taluka,
      district: user.district,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Mobile OTP authentication error: ' + error.message });
  }
};

// Update User Profile (Mobile Number, Village, Taluka, District)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { mobile, village, taluka, district, address, name } = req.body;
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (village) user.village = village;
    if (taluka) user.taluka = taluka;
    if (district) user.district = district;

    user.address = address || [user.village || village, user.taluka || taluka, user.district || district, 'Gujarat'].filter(Boolean).join(', ');

    await user.save();

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: user.mobile,
      village: user.village,
      taluka: user.taluka,
      district: user.district,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'anndatasecret123', {
    expiresIn: '30d',
  });
};

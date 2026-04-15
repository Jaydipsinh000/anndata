import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateContractPDF = (booking, fileName) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      
      const contractsDir = path.join(process.cwd(), 'uploads', 'contracts');
      if (!fs.existsSync(contractsDir)) {
          fs.mkdirSync(contractsDir, { recursive: true });
      }

      const filePath = path.join(contractsDir, fileName);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('ANNDATA B2B PLATFORM', { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text('OFFICIAL SMART CONTRACT / EOI', { align: 'center' });
      doc.moveDown(2);

      // Deal Summary
      doc.fontSize(12).font('Helvetica-Bold').text('Deal Identifier:');
      doc.font('Helvetica').text(`ID: ${booking._id}`);
      doc.text(`Status: ${booking.status.toUpperCase()}`);
      doc.text(`Date of Agreement: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      // Parties
      doc.font('Helvetica-Bold').text('Parties Involved:');
      doc.font('Helvetica').text(`Buyer: ${booking.buyer_id?.name || 'Authorized Buyer'}`);
      doc.text(`Farmer / Seller: ${booking.farmer_id?.name || 'Verified Farmer'}`);
      doc.moveDown();

      // Terms
      doc.font('Helvetica-Bold').text('Agreed Terms of Trade:');
      doc.font('Helvetica').text(`Crop ID Reference: ${booking.crop_id}`);
      doc.text(`Final Quantity: ${booking.requested_qty} units`);
      doc.text(`Agreed Price: INR ${booking.offered_price || booking.estimated_cost}`);
      doc.moveDown();

      // Financials
      let total = (booking.offered_price || booking.estimated_cost) * booking.requested_qty;
      doc.font('Helvetica-Bold').text('Total Contract Value:');
      doc.font('Helvetica').text(`INR ${total.toLocaleString()}`);
      doc.moveDown(2);

      // Trust statement
      doc.fontSize(10).font('Helvetica-Oblique').text('This document serves as a mutually agreed digital handshake via the Anndata platform. Both parties are obligated to honor the final terms negotiated.', { align: 'justify' });
      
      doc.end();

      stream.on('finish', () => {
        resolve(`/uploads/contracts/${fileName}`);
      });

      stream.on('error', (err) => {
        reject(err);
      });

    } catch (err) {
       reject(err);
    }
  });
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Service = require('./models/Service');
const Product = require('./models/Product');

const serviceImages = {
  'Classic Haircut': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
  'Premium Haircut': 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
  'Kids Haircut': 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
  'Beard Trim': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
  'Beard Styling': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
  'Royal Shave': 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&q=80',
  'Full Hair Coloring': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
  'Highlights': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'Basic Facial': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
  'Premium Facial': 'https://images.unsplash.com/photo-1512290900672-1f553315a67a?auto=format&fit=crop&w=800&q=80',
  'Head Massage': 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80',
  'Full Body Massage': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
};

const productImages = {
  'Premium Hair Wax': 'https://images.unsplash.com/photo-1608248597359-0095818fa8f9?auto=format&fit=crop&w=800&q=80',
  'Argan Oil Shampoo': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
  'Beard Oil - Sandalwood': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  'Hair Gel Extra Hold': 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
  'Moisturizing Face Cream': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  'Anti-Dandruff Shampoo': 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?auto=format&fit=crop&w=800&q=80',
  'Hair Color - Jet Black': 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
  'Professional Scissors': 'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80',
  'Pomade Classic': 'https://images.unsplash.com/photo-1597354984706-fac992d9306f?auto=format&fit=crop&w=800&q=80',
  'Aftershave Balm': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80',
};

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/salon_management');
    console.log('MongoDB Connected for updating images...');

    for (const [name, image] of Object.entries(serviceImages)) {
      const res = await Service.updateMany({ name }, { $set: { image } });
      console.log(`Service "${name}": matched ${res.matchedCount}, modified ${res.modifiedCount}`);
    }

    for (const [name, image] of Object.entries(productImages)) {
      const res = await Product.updateMany({ name }, { $set: { image } });
      console.log(`Product "${name}": matched ${res.matchedCount}, modified ${res.modifiedCount}`);
    }

    console.log('Finished updating service and product images.');
    process.exit(0);
  } catch (error) {
    console.error('Update images error:', error);
    process.exit(1);
  }
};

updateImages();

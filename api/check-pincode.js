export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { pincode } = req.body;

    // Validate pincode
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 6-digit pincode'
      });
    }

    // Get API credentials from environment variables
    const accessToken = process.env.ITHINK_ACCESS_TOKEN;
    const secretKey = process.env.ITHINK_SECRET_KEY;

    if (!accessToken || !secretKey) {
      console.error('Missing API credentials');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    // Warehouse pincode (hardcoded as per requirement)
    const warehousePincode = '203207';

    // Call iThink Logistics API
    const response = await fetch('https://my.ithinklogistics.com/api_v3/pincode/check.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        data: {
          pincode: pincode,
          access_token: accessToken,
          secret_key: secretKey
        }
      })
    });

    const data = await response.json();

    if (data.status !== 'success' || !data.data) {
      return res.status(200).json({
        success: true,
        data: {
          pincode: pincode,
          warehousePincode: warehousePincode,
          deliveryAvailable: false,
          delhivery: null,
          remark: null,
          city: null,
          state: null
        }
      });
    }

    const pincodeData = data.data[pincode];

    if (!pincodeData) {
      return res.status(200).json({
        success: true,
        data: {
          pincode: pincode,
          warehousePincode: warehousePincode,
          deliveryAvailable: false,
          delhivery: null,
          remark: null,
          city: null,
          state: null
        }
      });
    }

    // Get Delhivery data
    const delhivery = pincodeData.Delhivery || pincodeData.delhivery;

    if (delhivery && typeof delhivery === 'object') {
      return res.status(200).json({
        success: true,
        data: {
          pincode: pincode,
          warehousePincode: warehousePincode,
          deliveryAvailable: true,
          remark: pincodeData.remark || null,
          city: pincodeData.city_name || null,
          state: pincodeData.state_name || null,
          district: delhivery.district || null,
          stateCode: delhivery.state_code || null,
          area: pincodeData.area_name || null,
          delhivery: {
            prepaid: delhivery.prepaid === 'Y',
            cod: delhivery.cod === 'Y',
            pickup: delhivery.pickup === 'Y',
            district: delhivery.district,
            stateCode: delhivery.state_code,
            sortCode: delhivery.sort_code
          }
        }
      });
    }

    // Delhivery not available
    return res.status(200).json({
      success: true,
      data: {
        pincode: pincode,
        warehousePincode: warehousePincode,
        deliveryAvailable: false,
        delhivery: null,
        remark: pincodeData.remark || null,
        city: pincodeData.city_name || null,
        state: pincodeData.state_name || null,
        district: pincodeData.district_name || null,
        area: pincodeData.area_name || null
      }
    });

  } catch (error) {
    console.error('Error checking pincode:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check pincode serviceability'
    });
  }
}

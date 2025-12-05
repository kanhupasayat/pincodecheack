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

    // Call iThink Logistics API for both pincodes
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

    // Check if API call was successful
    if (data.status !== 'success' || !data.data) {
      return res.status(200).json({
        success: false,
        message: 'Pincode not serviceable or invalid response from logistics API'
      });
    }

    // Get pincode data
    const pincodeData = data.data[pincode];

    if (!pincodeData) {
      return res.status(200).json({
        success: false,
        message: 'This pincode is not serviceable'
      });
    }

    // Fields to exclude (not actual carriers)
    const excludeFields = ['remark', 'state_name', 'city_name', 'city_id', 'state_id', 'district', 'state', 'pin'];

    // Process carriers data
    const carriers = Object.keys(pincodeData).filter(
      key => !excludeFields.includes(key.toLowerCase())
    );
    const allCarriers = [];
    let deliveryAvailable = false;
    let codAvailable = false;
    let bestCarrier = null;

    for (const carrierName of carriers) {
      const carrier = pincodeData[carrierName];

      // Skip if carrier data is not an object
      if (typeof carrier !== 'object' || carrier === null) continue;

      const isDeliveryAvailable = carrier.prepaid === 'Y' || carrier.cod === 'Y';
      const isCodAvailable = carrier.cod === 'Y';

      if (isDeliveryAvailable) {
        deliveryAvailable = true;

        if (!bestCarrier) {
          bestCarrier = {
            name: carrierName.charAt(0).toUpperCase() + carrierName.slice(1),
            cod: isCodAvailable
          };
        }
      }

      if (isCodAvailable) {
        codAvailable = true;
      }

      allCarriers.push({
        name: carrierName.charAt(0).toUpperCase() + carrierName.slice(1),
        cod: isCodAvailable,
        prepaid: carrier.prepaid === 'Y',
        pickup: carrier.pickup === 'Y',
        days: carrier.delivery_days || '2-5',
        district: carrier.district,
        state: carrier.state_code
      });
    }

    // Return processed response
    return res.status(200).json({
      success: true,
      data: {
        pincode: pincode,
        warehousePincode: warehousePincode,
        deliveryAvailable: deliveryAvailable,
        codAvailable: codAvailable,
        carrier: bestCarrier?.name || null,
        estimatedDays: '2-5',
        allCarriers: allCarriers
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

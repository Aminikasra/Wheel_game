# Wheel_game
---
permalink: /index.html
---

<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مدیریت گردونه شانس</title>
    <style>
        body { font-family: Tahoma; text-align: center; background: #f0f2f5; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .btn { background: #e74c3c; color: white; border: none; padding: 12px 25px; font-size: 16px; border-radius: 8px; cursor: pointer; margin: 10px; }
        .qr-container { margin: 20px 0; padding: 20px; border: 2px dashed #ddd; border-radius: 10px; }
        .stats { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 مدیریت گردونه شانس</h1>
        <p>QR کد یکبار مصرف برای تراکت فروشگاه</p>
        
        <button class="btn" onclick="generateQR()">تولید QR کد جدید</button>
        
        <div class="qr-container">
            <div id="qrCode"></div>
            <div id="qrInfo"></div>
        </div>
        
        <div class="stats">
            <h3>📊 آمار</h3>
            <p>تعداد تولید شده: <span id="totalCount">0</span></p>
            <p>تعداد استفاده شده: <span id="usedCount">0</span></p>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.0/build/qrcode.min.js"></script>
    <script>
        // کدهای JavaScript همون قبلی رو اینجا قرار بدید
    </script>
</body>
</html>

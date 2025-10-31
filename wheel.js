class WheelGame {
    constructor() {
        this.canvas = document.getElementById('wheel');
        this.ctx = this.canvas.getContext('2d');
        this.spinBtn = document.getElementById('spinBtn');
        this.resultDiv = document.getElementById('result');
        this.couponDiv = document.getElementById('coupon');
        this.errorDiv = document.getElementById('error');
        
        this.isSpinning = false;
        this.rotation = 0;
        
        // بخش‌های گردونه - نمایش ۱-۱۰۰ ولی فقط ۱-۳۰ شانس داره
        this.segments = this.createSegments();
        
        this.init();
    }

    createSegments() {
        const segments = [];
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
        
        // ایجاد ۱۰۰ بخش با ظاهر ولی فقط ۳۰ بخش اول شانس واقعی
        for (let i = 1; i <= 100; i++) {
            segments.push({
                value: i,
                text: i + '%',
                color: colors[i % colors.length],
                isReal: i <= 30 // فقط ۱-۳۰ شانس واقعی دارن
            });
        }
        return segments;
    }

    init() {
        this.checkQR();
        this.drawWheel();
        this.spinBtn.addEventListener('click', () => this.spin());
    }

    getQRId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('q');
    }

    checkQR() {
        const qrId = this.getQRId();
        if (!qrId) {
            this.showError('QR کد معتبر نیست');
            return;
        }

        const data = JSON.parse(localStorage.getItem('wheelQRCodes') || '{"qrcodes":{}}');
        const qrData = data.qrcodes[qrId];

        if (!qrData) {
            this.showError('QR کد پیدا نشد');
            return;
        }

        if (qrData.used) {
            this.showError('این QR کد قبلاً استفاده شده است');
            this.spinBtn.disabled = true;
        }
    }

    showError(message) {
        this.errorDiv.style.display = 'block';
        this.errorDiv.textContent = '❌ ' + message;
        this.spinBtn.disabled = true;
    }

    drawWheel() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = this.canvas.width / 2 - 10;
        const segmentAngle = (2 * Math.PI) / this.segments.length;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.segments.forEach((segment, index) => {
            const startAngle = index * segmentAngle + this.rotation;
            const endAngle = (index + 1) * segmentAngle + this.rotation;

            // رسم بخش
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = segment.color;
            this.ctx.fill();
            this.ctx.stroke();

            // نوشتن متن
            this.ctx.save();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(startAngle + segmentAngle / 2);
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Tahoma';
            
            // فقط اعداد ۱۰تایی نمایش داده بشن برای شلوغ نشدن
            if (segment.value % 10 === 0 || segment.value <= 10) {
                this.ctx.fillText(segment.text, radius - 15, 5);
            }
            
            this.ctx.restore();
        });

        // رسم مرکز
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fill();
        this.ctx.stroke();
    }

    async spin() {
        if (this.isSpinning) return;

        const qrId = this.getQRId();
        if (!qrId) return;

        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.resultDiv.textContent = '';
        this.couponDiv.style.display = 'none';

        // انتخاب تصادفی بین ۱-۳۰
        const winningValue = Math.floor(Math.random() * 30) + 1;
        
        // محاسبه زاویه برنده
        const targetRotation = this.rotation + (5 * 2 * Math.PI) + 
                             ((winningValue - 1) * (2 * Math.PI / this.segments.length));

        // انیمیشن چرخش
        await this.animateSpin(targetRotation);
        
        // نمایش نتیجه
        this.showResult(winningValue);
        
        // ذخیره نتیجه
        this.saveResult(qrId, winningValue);
    }

    animateSpin(targetRotation) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const duration = 4000;

            const animate = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOut = 1 - Math.pow(1 - progress, 3);
                this.rotation = easeOut * targetRotation;
                
                this.drawWheel();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isSpinning = false;
                    resolve();
                }
            };

            animate();
        });
    }

    showResult(discount) {
        const couponCode = 'DISC' + Date.now().toString(36).toUpperCase().substr(0, 8);
        
        this.resultDiv.textContent = `🎉 تبریک! شما ${discount}% تخفیف گرفتید!`;
        this.resultDiv.style.background = '#d4edda';
        this.resultDiv.style.color = '#155724';
        
        this.couponDiv.style.display = 'block';
        this.couponDiv.textContent = `کد تخفیف: ${couponCode}`;
    }

    saveResult(qrId, discount) {
        const data = JSON.parse(localStorage.getItem('wheelQRCodes'));
        if (data.qrcodes[qrId]) {
            data.qrcodes[qrId].used = true;
            data.qrcodes[qrId].result = discount;
            data.qrcodes[qrId].usedAt = new Date().toLocaleString('fa-IR');
            data.stats.used++;
            localStorage.setItem('wheelQRCodes', JSON.stringify(data));
        }
    }
}

// راه‌اندازی بازی
new WheelGame();

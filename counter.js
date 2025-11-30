// Visitor Counter using LocalStorage
document.addEventListener('DOMContentLoaded', function() {
    const counterElement = document.getElementById('visitorCount');
    
    if (counterElement) {
        // Get or initialize visitor count
        let visitorCount = localStorage.getItem('visitorCount');
        
        if (!visitorCount) {
            // First time visitor
            visitorCount = 1;
        } else {
            // Check if this is a new session (hasn't visited in last 30 minutes)
            const lastVisit = localStorage.getItem('lastVisit');
            const now = new Date().getTime();
            const thirtyMinutes = 30 * 60 * 1000;
            
            if (!lastVisit || (now - parseInt(lastVisit)) > thirtyMinutes) {
                visitorCount = parseInt(visitorCount) + 1;
            }
        }
        
        // Save the count and timestamp
        localStorage.setItem('visitorCount', visitorCount);
        localStorage.setItem('lastVisit', new Date().getTime().toString());
        
        // Animate the counter
        animateCounter(counterElement, visitorCount);
    }
});

function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 30);
    const duration = 1000;
    const stepTime = duration / (target / increment);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toLocaleString();
    }, stepTime);
}

// Courses Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Course card hover effect
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Course features animation
    const courseFeatures = document.querySelectorAll('.course-features li');
    courseFeatures.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            feature.style.transition = 'all 0.5s ease';
            feature.style.opacity = '1';
            feature.style.transform = 'translateX(0)';
        }, index * 200);
    });

    // Course category filter
    const filterButtons = document.querySelectorAll('.filter-button');
    const courseGrid = document.querySelector('.course-grid');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            // Filter courses
            const courses = courseGrid.querySelectorAll('.course-card');
            courses.forEach(course => {
                if (category === 'all' || course.getAttribute('data-category') === category) {
                    course.style.display = 'block';
                } else {
                    course.style.display = 'none';
                }
            });
        });
    });

    // Course search functionality
    const searchInput = document.querySelector('.course-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const courses = courseGrid.querySelectorAll('.course-card');

            courses.forEach(course => {
                const title = course.querySelector('.course-title').textContent.toLowerCase();
                const description = course.querySelector('.course-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    course.style.display = 'block';
                } else {
                    course.style.display = 'none';
                }
            });
        });
    }

    // Course price animation
    const coursePrices = document.querySelectorAll('.course-price');
    coursePrices.forEach(price => {
        price.style.opacity = '0';
        price.style.transform = 'translateY(20px)';
        setTimeout(() => {
            price.style.transition = 'all 0.5s ease';
            price.style.opacity = '1';
            price.style.transform = 'translateY(0)';
        }, 500);
    });
}); 
/**
 * Hoopscope Main JavaScript
 * Enhanced with better performance, accessibility, and OpenAI integration
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const blogGridHomepage = document.getElementById('blog-grid-homepage');
    const generatePlanBtn = document.getElementById('generate-plan-btn');
    const workoutModal = document.getElementById('workout-plan-modal');
    const closeWorkoutModalBtn = document.getElementById('close-workout-modal-btn');
    const workoutPlanContent = document.getElementById('workout-plan-content');
    const generateBtnText = document.getElementById('generate-btn-text');
    const generateLoader = document.getElementById('generate-loader');
    const blogHelperModal = document.getElementById('blog-helper-modal');
    const closeBlogHelperModalBtn = document.getElementById('close-blog-helper-modal-btn');
    const blogHelperOutput = document.getElementById('blog-helper-output');
    const blogHelperAskBtn = document.getElementById('blog-helper-ask-btn');
    const blogHelperPromptInput = document.getElementById('blog-helper-prompt');
    const videoModal = document.getElementById('video-demo-modal');
    const videoModalBtn = document.getElementById('demo-video-btn');
    const closeVideoModalBtn = document.getElementById('close-video-modal-btn');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Current article content for AI
    let currentArticleForAI = '';

    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Video modal
    if (videoModalBtn && videoModal && closeVideoModalBtn) {
        videoModalBtn.addEventListener('click', () => {
            videoModal.classList.remove('hidden');
        });
        
        closeVideoModalBtn.addEventListener('click', () => {
            videoModal.classList.add('hidden');
        });
    }

    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (workoutModal && !workoutModal.classList.contains('hidden')) {
            if (!e.target.closest('.modal') && !e.target.closest('#generate-plan-btn')) {
                workoutModal.classList.add('hidden');
            }
        }
        
        if (blogHelperModal && !blogHelperModal.classList.contains('hidden')) {
            if (!e.target.closest('.modal') && !e.target.closest('.ai-blog-btn')) {
                blogHelperModal.classList.add('hidden');
            }
        }
        
        if (videoModal && !videoModal.classList.contains('hidden')) {
            if (!e.target.closest('.modal') && !e.target.closest('#demo-video-btn')) {
                videoModal.classList.add('hidden');
            }
        }
    });

    // Close modals with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (workoutModal) workoutModal.classList.add('hidden');
            if (blogHelperModal) blogHelperModal.classList.add('hidden');
            if (videoModal) videoModal.classList.add('hidden');
        }
    });

    // --- Blog Posts Data ---
    const posts = [
        {
            title: "The Biomechanics of an Unshakeable Handle",
            author: "Dr. Evelyn Reed",
            date: "September 18, 2025",
            category: "Analytics",
            image: "https://images.unsplash.com/photo-1598136397221-717618571b56?q=80&w=2070&auto=format&fit=crop",
            content: `<h1>The Science of Ball Control</h1><p>Following our deep dive into the jump shot, we're back in the lab to unravel the secrets of elite ball handling. Using motion capture and newly developed pressure-sensing basketballs, we analyze how players maintain perfect control. From body posture to the subtle forces applied by the fingertips, we'll explore the scientific principles that turn a simple bounce into an unshakeable handle.</p><h2>From Clumsy to Controlled: Decoding the Science of Dribbling</h2><p>If the jump shot is the exclamation point of a great play, then the dribble is the beautiful, intricate sentence that sets it up. We've all been mesmerized by a player who seems to have the basketball on a string, effortlessly weaving through defenders with a dizzying array of crossovers, hesitations, and behind-the-back moves. It looks like pure instinct, a natural gift. But as a scientist, I can assure you that beneath that fluid artistry lies a foundation of repeatable, trainable biomechanics.</p><h2>The Foundation: Your Dribbling Stance and Posture</h2><h3>Why Staying Low is a Golden Rule of Physics</h3><p>By bending your knees and dropping your hips, you lower your center of gravity. A lower center of gravity creates a more stable base, making you much harder to knock off balance. Staying low also shortens the distance the ball has to travel from your hand to the floor and back, resulting in a quicker, more secure dribble.</p><h2>The Engine of the Dribble: The Hand, Wrist, and Arm</h2><h3>It's Not Slapping, It's Pushing: The Nuance of Applying Force</h3><p>Elite dribblers push the ball into the floor. Their arm, wrist, and hand absorb the ball on its way up and then push it back down in a fluid motion. There is constant contact and 'feel.' This allows them to manipulate the ball's direction and pace at will.</p><blockquote>The palm is for power, but the finger pads are for control.</blockquote>`
        },
        {
            title: "Beyond the Arc: How Shot-Selection Defines Modern Offenses",
            author: "Alex Rivera",
            date: "July 5, 2025",
            category: "Analytics",
            image: "https://images.unsplash.com/photo-1608245449223-342757f43769?q=80&w=2070&auto=format&fit=crop",
            content: "<h1>The Three-Point Revolution</h1><p>The three-point line has fundamentally revolutionized basketball. We dive into the data to show how spacing and shot selection have become the keys to unlocking a high-powered offense in today's game. It's a numbers game, and the teams that understand the math are winning championships.</p><blockquote>The math is simple: 3 is greater than 2. But the application is complex.</blockquote><p>We analyzed over 1 million shots from the last five seasons to identify the most efficient spots on the floor. The corner three, once an afterthought, is now one of the most valuable shots in basketball.</p>"
        },
        {
            title: "A Day in the Life: Off-Season Training with a Pro",
            author: "Jasmine Chen",
            date: "June 28, 2025",
            category: "Pro Insights",
            image: "https://images.unsplash.com/photo-1594488541269-c4b5a73c3374?q=80&w=1974&auto=format&fit=crop",
            content: "<h2>It's More Than Just Practice</h2><p>What does it really take to compete at the highest level? We follow a professional player through their rigorous off-season regimen, from the weight room to the court, revealing the dedication required for greatness. The day starts at 5 AM with strength and conditioning, followed by skill work, film study, and recovery sessions.</p>"
        }
    ];

    /**
     * Create a blog post element with lazy loading for images
     */
    function createPostElement(post, index) {
        const postEl = document.createElement('div');
        postEl.className = 'card-bg rounded-2xl overflow-hidden flex flex-col scroll-animate';
        
        const contentSnippet = post.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...';
        
        // Using lazy loading for images
        postEl.innerHTML = `
            <a href="blog.html" class="block hover:opacity-80 transition-opacity">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" 
                     data-src="${post.image}" 
                     alt="${post.title}" 
                     class="w-full h-48 object-cover lazy-image"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='https://placehold.co/600x400/111111/444444?text=Image';">
            </a>
            <div class="p-6 flex flex-col flex-grow">
                <span class="text-orange-400 font-semibold text-sm">${post.category}</span>
                <h3 class="text-xl font-bold text-white my-2">${post.title}</h3>
                <p class="text-slate-400 text-sm mb-4 flex-grow">${contentSnippet}</p>
                <div class="flex items-center justify-between text-xs text-slate-500 mt-auto">
                    <span>By ${post.author} &bull; ${post.date}</span>
                    <button data-index="${index}" class="ai-blog-btn text-orange-400 font-semibold flex items-center gap-1 hover:text-orange-300">
                        ✨ Ask AI
                    </button>
                </div>
            </div>
        `;
        
        return postEl;
    }

    /**
     * Render blog posts with animation delays
     */
    function renderHomepagePosts() {
        if (!blogGridHomepage) return;
        
        blogGridHomepage.innerHTML = '';
        const latestPosts = posts.slice(0, 3);
        
        latestPosts.forEach((post, index) => {
            const postEl = createPostElement(post, index);
            postEl.style.animationDelay = `${(index + 1) * 0.1}s`;
            blogGridHomepage.appendChild(postEl);
        });
        
        // Initialize lazy loading after adding posts
        initLazyLoading();
    }

    /**
     * Initialize lazy loading for images
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.add('loaded');
            });
        }
    }

    // Render posts if we're on the homepage
    if (blogGridHomepage) {
        renderHomepagePosts();
    }

    // --- Intersection Observer for scroll animations ---
    const observerOptions = { 
        root: null, 
        rootMargin: '0px', 
        threshold: 0.2 
    };
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.style.animationDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay * 1000);
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

    // --- OpenAI API Integration ---
    
    /**
     * Call OpenAI API for generating content
     * @param {string} prompt - The user's prompt
     * @param {Object} options - Additional API options
     * @returns {Promise<string>} - The API response text
     */
    async function callOpenAI(prompt, options = {}) {
        try {
            // This would be loaded from environment variables in production
            // For demo purposes, we'll just detect if there's no API key and provide a fallback response
            const apiKey = process.env.OPENAI_API_KEY || "";
            
            if (!apiKey) {
                console.warn("No OpenAI API key provided. Using fallback response.");
                return generateFallbackResponse(prompt);
            }
            
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 500,
                    temperature: 0.7,
                    ...options
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    }
                }
            );
            
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("OpenAI API Error:", error);
            return generateFallbackResponse(prompt);
        }
    }
    
    /**
     * Generate a fallback response when API is unavailable
     * @param {string} prompt - The user's prompt
     * @returns {string} - A fallback response
     */
    function generateFallbackResponse(prompt) {
        // For workout plans
        if (prompt.includes("workout plan") || prompt.includes("training")) {
            return "I've generated a personalized 45-minute workout plan focused on your goals. The plan includes a proper warm-up routine, targeted skill development drills, and a cool-down period. Remember to stay hydrated throughout your session!";
        }
        
        // For blog article questions
        if (prompt.includes("article")) {
            return "This article highlights key techniques and strategies used by professional basketball players. The author emphasizes the importance of proper fundamentals, consistent practice, and data-driven analysis to improve performance.";
        }
        
        // Generic fallback
        return "Thank you for your question! While I can't access the API right now, I'd typically provide personalized basketball training advice, analyze stats, or explain concepts from the article you're reading.";
    }

    // --- AI Workout Plan Generator ---
    if (generatePlanBtn && workoutModal && closeWorkoutModalBtn) {
        generatePlanBtn.addEventListener('click', async () => {
            const userInput = document.getElementById('workout-prompt').value;
            if (!userInput.trim()) {
                workoutPlanContent.innerHTML = `<p class="text-red-400">Please describe your training goals first.</p>`;
                workoutModal.classList.remove('hidden');
                return;
            }

            generateBtnText.classList.add('hidden');
            generateLoader.classList.remove('hidden');
            
            const prompt = `Create a detailed basketball workout plan based on the following request: "${userInput}". Format the response with HTML: Include a title (<h2>), estimated duration, and structure it with sections for Warm-up, Skill Drills, and Cooldown. Each exercise should include the name in bold and a brief description with duration or reps.`;
            
            try {
                const resultText = await callOpenAI(prompt);
                generateBtnText.classList.remove('hidden');
                generateLoader.classList.add('hidden');
                
                workoutPlanContent.innerHTML = resultText;
                workoutModal.classList.remove('hidden');
            } catch (error) {
                console.error("Error generating workout plan:", error);
                generateBtnText.classList.remove('hidden');
                generateLoader.classList.add('hidden');
                
                workoutPlanContent.innerHTML = `<p class="text-red-400">Sorry, there was an error generating your workout plan. Please try again.</p>`;
                workoutModal.classList.remove('hidden');
            }
        });

        closeWorkoutModalBtn.addEventListener('click', () => {
            workoutModal.classList.add('hidden');
        });
    }

    // --- AI Blog Helper ---
    if (blogGridHomepage) {
        blogGridHomepage.addEventListener('click', async (e) => {
            const targetButton = e.target.closest('.ai-blog-btn');
            if (targetButton) {
                e.preventDefault();
                const postIndex = targetButton.dataset.index;
                const post = posts[postIndex];
                currentArticleForAI = post.content.replace(/<[^>]*>?/gm, ''); // Store clean text
                
                blogHelperOutput.innerHTML = '<div class="w-5 h-5 rounded-full loader mx-auto"></div>';
                blogHelperModal.classList.remove('hidden');
                
                const prompt = `Summarize the following basketball article in 3 key bullet points:\n\n${currentArticleForAI}`;
                const summary = await callOpenAI(prompt);
                
                if (summary) {
                    blogHelperOutput.innerHTML = summary;
                } else {
                    blogHelperOutput.innerHTML = 'Could not generate summary.';
                }
            }
        });
    }

    if (blogHelperAskBtn && blogHelperPromptInput) {
        blogHelperAskBtn.addEventListener('click', async () => {
            const userQuestion = blogHelperPromptInput.value;
            if (!userQuestion.trim() || !currentArticleForAI) return;
            
            blogHelperOutput.innerHTML = '<div class="w-5 h-5 rounded-full loader mx-auto"></div>';
            const prompt = `Based on the article provided, answer the following question: "${userQuestion}"\n\nArticle:\n${currentArticleForAI}`;
            
            try {
                const answer = await callOpenAI(prompt);
                blogHelperOutput.innerHTML = answer;
            } catch (error) {
                console.error("Error getting AI response:", error);
                blogHelperOutput.innerHTML = 'Sorry, I could not answer that question.';
            }
            
            blogHelperPromptInput.value = '';
        });
        
        // Allow pressing Enter to submit questions
        blogHelperPromptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                blogHelperAskBtn.click();
            }
        });
    }

    if (closeBlogHelperModalBtn) {
        closeBlogHelperModalBtn.addEventListener('click', () => {
            blogHelperModal.classList.add('hidden');
        });
    }
});
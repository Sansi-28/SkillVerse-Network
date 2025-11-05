package com.skillverse;

import com.skillverse.model.entity.Listing;
import com.skillverse.model.entity.User;
import com.skillverse.repository.ListingRepository;
import com.skillverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private ListingRepository listingRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Only run if there are no users yet
        if (userRepository.count() == 0) {
            System.out.println("No users found. Seeding initial data...");

            // Create Escrow User
            User escrowUser = new User("Platform Escrow", "escrow@system.internal", passwordEncoder.encode("cannot-be-logged-in"));
            escrowUser.setTokenBalance(BigDecimal.ZERO);
            userRepository.save(escrowUser);

            // Create 10 Sample Users
            User u1 = new User("Alice Teacher", "alice@example.com", passwordEncoder.encode("password123"));
            u1.setBio("Certified JS developer with 5 years of experience. Loves teaching React!");
            u1.setSkillsOffered(List.of("JavaScript", "React", "HTML/CSS"));
            u1.setSkillsWanted(List.of("Python", "Guitar"));

            User u2 = new User("Bob Learner", "bob@example.com", passwordEncoder.encode("password123"));
            u2.setBio("Beginner programmer eager to learn new things.");
            u2.setSkillsWanted(List.of("JavaScript"));

            User u3 = new User("Charlie Coder", "charlie@example.com", passwordEncoder.encode("password123"));
            u3.setBio("Python and Django expert. Also teaches data science basics.");
            u3.setSkillsOffered(List.of("Python", "Django", "Data Science"));

            User u4 = new User("Diana Designer", "diana@example.com", passwordEncoder.encode("password123"));
            u4.setBio("UI/UX designer passionate about creating beautiful interfaces. Can teach Figma.");
            u4.setSkillsOffered(List.of("Figma", "UI Design", "UX Research"));
            u4.setSkillsWanted(List.of("JavaScript"));

            User u5 = new User("Ethan Engineer", "ethan@example.com", passwordEncoder.encode("password123"));
            u5.setSkillsOffered(List.of("Java", "Spring Boot"));

            User u6 = new User("Fiona Musician", "fiona@example.com", passwordEncoder.encode("password123"));
            u6.setBio("Guitarist for 10 years. Happy to teach chords and basic theory.");
            u6.setSkillsOffered(List.of("Guitar", "Music Theory"));

            User u7 = new User("George Gardener", "george@example.com", passwordEncoder.encode("password123"));
            u7.setSkillsWanted(List.of("Cooking"));

            User u8 = new User("Hannah Helper", "hannah@example.com", passwordEncoder.encode("password123"));

            User u9 = new User("Ian Innovator", "ian@example.com", passwordEncoder.encode("password123"));

            User u10 = new User("Alice Smith", "alicesmith@example.com", passwordEncoder.encode("password123"));
            u10.setBio("Another developer also named Alice!");

            userRepository.saveAll(List.of(u1, u2, u3, u4, u5, u6, u7, u8, u9, u10));

            // Create Sample Listings
            createListing(u1, "React Hooks Deep Dive", "A 60-minute session on useState and useEffect.", "90.00", "1:1 Session", 60);
            createListing(u1, "JavaScript Fundamentals", "Perfect for absolute beginners.", "75.00", "1:1 Session", 60);
            createListing(u3, "Python for Data Science", "Learn the basics of Pandas and NumPy.", "120.00", "Course", 180);
            createListing(u3, "Django Web Development Intro", "Build your first web app with Django.", "150.00", "Course", 240);
            createListing(u4, "Figma for Beginners", "Design your first mobile app screen.", "80.00", "1:1 Session", 90);
            createListing(u5, "Spring Boot Microservices", "Advanced topic for Java developers.", "200.00", "1:1 Session", 120);
            createListing(u6, "Acoustic Guitar for Beginners", "Learn your first three chords!", "50.00", "1:1 Session", 45);

            System.out.println("Data seeding complete.");
        }
    }

    private void createListing(User teacher, String title, String desc, String price, String format, int duration) {
        Listing listing = new Listing();
        listing.setTeacher(teacher);
        listing.setTitle(title);
        listing.setDescription(desc);
        listing.setTokenPrice(new BigDecimal(price));
        listing.setFormat(format);
        listing.setDurationMinutes(duration);
        listingRepository.save(listing);
    }
}
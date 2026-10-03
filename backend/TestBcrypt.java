import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBcrypt {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("HASH: " + encoder.encode("password"));
        System.out.println("MATCHES: " + encoder.matches("password", "$2a$10$w6yZ95M1/JkEaP03S1R8uep4zW07K96W6.9tFj4uU0.uI4E9r99yq"));
    }
}

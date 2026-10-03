# Use Maven and Java 17 for the build
FROM eclipse-temurin:17-jdk-jammy AS build

WORKDIR /app
COPY backend/.mvn/ ./backend/.mvn/
COPY backend/mvnw ./backend/mvnw
COPY backend/pom.xml ./backend/pom.xml
COPY backend/src ./backend/src

WORKDIR /app/backend
# Package the jar (tests are skipped here for speed, but run in CI)
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

package com.wezeep.config;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.wezeep.domain.model.BillPayment;
import com.wezeep.domain.model.BillVendor;
import com.wezeep.domain.model.CashbackOffer;
import com.wezeep.domain.model.Contact;
import com.wezeep.domain.model.MoneyRequest;
import com.wezeep.domain.model.PaymentMethod;
import com.wezeep.domain.model.Referral;
import com.wezeep.domain.model.RewardAccount;
import com.wezeep.domain.model.Transaction;
import com.wezeep.domain.model.User;
import com.wezeep.domain.model.Wallet;
import com.wezeep.domain.repository.BillPaymentRepository;
import com.wezeep.domain.repository.BillVendorRepository;
import com.wezeep.domain.repository.CashbackOfferRepository;
import com.wezeep.domain.repository.ContactRepository;
import com.wezeep.domain.repository.MoneyRequestRepository;
import com.wezeep.domain.repository.PaymentMethodRepository;
import com.wezeep.domain.repository.ReferralRepository;
import com.wezeep.domain.repository.RewardAccountRepository;
import com.wezeep.domain.repository.TransactionRepository;
import com.wezeep.domain.repository.UserRepository;
import com.wezeep.domain.repository.WalletRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
@Profile("dev")
public class DataSeeder {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final ContactRepository contactRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final BillVendorRepository billVendorRepository;
    private final BillPaymentRepository billPaymentRepository;
    private final TransactionRepository transactionRepository;
    private final MoneyRequestRepository moneyRequestRepository;
    private final CashbackOfferRepository cashbackOfferRepository;
    private final RewardAccountRepository rewardAccountRepository;
    private final ReferralRepository referralRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            log.info("Starting database seeding...");

            // Check if data already exists
            if (userRepository.count() > 0) {
                log.info("Database already contains data. Skipping seed.");
                return;
            }

            // Create Users
            List<User> users = createUsers();
            userRepository.saveAll(users);
            log.info("Created {} users", users.size());

            // Create Wallets for each user
            List<Wallet> wallets = createWallets(users);
            walletRepository.saveAll(wallets);
            log.info("Created {} wallets", wallets.size());

            // Create Contacts
            List<Contact> contacts = createContacts(users);
            contactRepository.saveAll(contacts);
            log.info("Created {} contacts", contacts.size());

            // Create Payment Methods
            List<PaymentMethod> paymentMethods = createPaymentMethods(users);
            paymentMethodRepository.saveAll(paymentMethods);
            log.info("Created {} payment methods", paymentMethods.size());

            // Create Bill Vendors
            List<BillVendor> billVendors = createBillVendors();
            billVendorRepository.saveAll(billVendors);
            log.info("Created {} bill vendors", billVendors.size());

            // Create Bill Payments
            List<BillPayment> billPayments = createBillPayments(users, billVendors);
            billPaymentRepository.saveAll(billPayments);
            log.info("Created {} bill payments", billPayments.size());

            // Create Transactions
            List<Transaction> transactions = createTransactions(users);
            transactionRepository.saveAll(transactions);
            log.info("Created {} transactions", transactions.size());

            // Create Money Requests
            List<MoneyRequest> moneyRequests = createMoneyRequests(users);
            moneyRequestRepository.saveAll(moneyRequests);
            log.info("Created {} money requests", moneyRequests.size());

            // Create Cashback Offers
            List<CashbackOffer> cashbackOffers = createCashbackOffers();
            cashbackOfferRepository.saveAll(cashbackOffers);
            log.info("Created {} cashback offers", cashbackOffers.size());

            // Create Reward Accounts
            List<RewardAccount> rewardAccounts = createRewardAccounts(users);
            rewardAccountRepository.saveAll(rewardAccounts);
            log.info("Created {} reward accounts", rewardAccounts.size());

            // Create Referrals
            List<Referral> referrals = createReferrals(users);
            referralRepository.saveAll(referrals);
            log.info("Created {} referrals", referrals.size());

            log.info("Database seeding completed successfully!");
            log.info("==============================================");
            log.info("TEST USER CREDENTIALS:");
            log.info("==============================================");
            log.info("Username: john.doe@example.com");
            log.info("Password: password123");
            log.info("Wezeep ID: johndoe");
            log.info("----------------------------------------------");
            log.info("Username: jane.smith@example.com");
            log.info("Password: password123");
            log.info("Wezeep ID: janesmith");
            log.info("----------------------------------------------");
            log.info("Username: alice.wong@example.com");
            log.info("Password: password123");
            log.info("Wezeep ID: alicewong");
            log.info("==============================================");
        };
    }

    private List<User> createUsers() {
        List<User> users = new ArrayList<>();

        // User 1: John Doe
        users.add(User.builder()
                .email("john.doe@example.com")
                .phoneNumber("+14155551234")
                .password(passwordEncoder.encode("password123"))
                .firstName("John")
                .lastName("Doe")
                .wezeepId("johndoe")
                .homeCountry("US")
                .preferredCurrency(User.PreferredCurrency.USD)
                .privacyToggleEnabled(false)
                .build());

        // User 2: Jane Smith
        users.add(User.builder()
                .email("jane.smith@example.com")
                .phoneNumber("+14155555678")
                .password(passwordEncoder.encode("password123"))
                .firstName("Jane")
                .lastName("Smith")
                .wezeepId("janesmith")
                .homeCountry("US")
                .preferredCurrency(User.PreferredCurrency.USD)
                .privacyToggleEnabled(true)
                .build());

        // User 3: Alice Wong
        users.add(User.builder()
                .email("alice.wong@example.com")
                .phoneNumber("+14155559012")
                .password(passwordEncoder.encode("password123"))
                .firstName("Alice")
                .lastName("Wong")
                .wezeepId("alicewong")
                .homeCountry("GB")
                .preferredCurrency(User.PreferredCurrency.LOCAL_CURRENCY)
                .privacyToggleEnabled(false)
                .build());

        // User 4: Bob Martinez
        users.add(User.builder()
                .email("bob.martinez@example.com")
                .phoneNumber("+14155553456")
                .password(passwordEncoder.encode("password123"))
                .firstName("Bob")
                .lastName("Martinez")
                .wezeepId("bobmartinez")
                .homeCountry("MX")
                .preferredCurrency(User.PreferredCurrency.LOCAL_CURRENCY)
                .privacyToggleEnabled(false)
                .build());

        // User 5: Emma Johnson
        users.add(User.builder()
                .email("emma.johnson@example.com")
                .phoneNumber("+14155557890")
                .password(passwordEncoder.encode("password123"))
                .firstName("Emma")
                .lastName("Johnson")
                .wezeepId("emmajohnson")
                .homeCountry("CA")
                .preferredCurrency(User.PreferredCurrency.LOCAL_CURRENCY)
                .privacyToggleEnabled(true)
                .build());

        return users;
    }

    private List<Wallet> createWallets(List<User> users) {
        List<Wallet> wallets = new ArrayList<>();

        for (User user : users) {
            // USD Wallet
            wallets.add(Wallet.builder()
                    .user(user)
                    .currency("USD")
                    .balance(new BigDecimal("1250.75"))
                    .build());

            // EUR Wallet
            wallets.add(Wallet.builder()
                    .user(user)
                    .currency("EUR")
                    .balance(new BigDecimal("500.00"))
                    .build());

            // GBP Wallet
            wallets.add(Wallet.builder()
                    .user(user)
                    .currency("GBP")
                    .balance(new BigDecimal("750.50"))
                    .build());
        }

        return wallets;
    }

    private List<Contact> createContacts(List<User> users) {
        List<Contact> contacts = new ArrayList<>();

        if (users.size() >= 5) {
            // John's contacts
            contacts.add(Contact.builder()
                    .user(users.get(0))
                    .firstName("Jane")
                    .lastName("Smith")
                    .wezeepId("janesmith")
                    .phoneNumber("+14155555678")
                    .build());

            contacts.add(Contact.builder()
                    .user(users.get(0))
                    .firstName("Alice")
                    .lastName("Wong")
                    .wezeepId("alicewong")
                    .phoneNumber("+14155559012")
                    .build());

            // Jane's contacts
            contacts.add(Contact.builder()
                    .user(users.get(1))
                    .firstName("John")
                    .lastName("Doe")
                    .wezeepId("johndoe")
                    .phoneNumber("+14155551234")
                    .build());

            contacts.add(Contact.builder()
                    .user(users.get(1))
                    .firstName("Emma")
                    .lastName("Johnson")
                    .wezeepId("emmajohnson")
                    .phoneNumber("+14155557890")
                    .build());

            // Alice's contacts
            contacts.add(Contact.builder()
                    .user(users.get(2))
                    .firstName("Bob")
                    .lastName("Martinez")
                    .wezeepId("bobmartinez")
                    .phoneNumber("+14155553456")
                    .build());
        }

        return contacts;
    }

    private List<PaymentMethod> createPaymentMethods(List<User> users) {
        List<PaymentMethod> paymentMethods = new ArrayList<>();

        for (User user : users) {
            // Wezeep Wallet (default)
            paymentMethods.add(PaymentMethod.builder()
                    .user(user)
                    .type(PaymentMethod.PaymentMethodType.WEEZEEP_WALLET)
                    .provider("Wezeep")
                    .isDefault(true)
                    .isActive(true)
                    .build());

            // Bank Account
            paymentMethods.add(PaymentMethod.builder()
                    .user(user)
                    .type(PaymentMethod.PaymentMethodType.BANK_ACCOUNT)
                    .provider("Chase Bank")
                    .providerAccountId("****1234")
                    .isDefault(false)
                    .isActive(true)
                    .build());

            // Debit Card
            paymentMethods.add(PaymentMethod.builder()
                    .user(user)
                    .type(PaymentMethod.PaymentMethodType.DEBIT_CARD)
                    .provider("Visa")
                    .providerAccountId("****5678")
                    .isDefault(false)
                    .isActive(true)
                    .build());
        }

        return paymentMethods;
    }

    private List<BillVendor> createBillVendors() {
        List<BillVendor> vendors = new ArrayList<>();

        vendors.add(BillVendor.builder()
                .name("Pacific Gas & Electric")
                .category("Utilities")
                .icon("⚡")
                .color("#4CAF50")
                .build());

        vendors.add(BillVendor.builder()
                .name("AT&T")
                .category("Telecommunications")
                .icon("📱")
                .color("#2196F3")
                .build());

        vendors.add(BillVendor.builder()
                .name("Comcast Xfinity")
                .category("Internet")
                .icon("🌐")
                .color("#FF9800")
                .build());

        vendors.add(BillVendor.builder()
                .name("Netflix")
                .category("Entertainment")
                .icon("🎬")
                .color("#E50914")
                .build());

        vendors.add(BillVendor.builder()
                .name("Spotify")
                .category("Entertainment")
                .icon("🎵")
                .color("#1DB954")
                .build());

        vendors.add(BillVendor.builder()
                .name("Water District")
                .category("Utilities")
                .icon("💧")
                .color("#03A9F4")
                .build());

        return vendors;
    }

    private List<BillPayment> createBillPayments(List<User> users, List<BillVendor> vendors) {
        List<BillPayment> payments = new ArrayList<>();

        if (users.size() >= 3 && vendors.size() >= 4) {
            // John's bill payments
            payments.add(BillPayment.builder()
                    .user(users.get(0))
                    .vendor(vendors.get(0)) // PG&E
                    .amount(new BigDecimal("125.50"))
                    .currency("USD")
                    .reference("BILL-12345678")
                    .status(BillPayment.BillPaymentStatus.COMPLETED)
                    .completedAt(Instant.now().minus(5, ChronoUnit.DAYS))
                    .build());

            payments.add(BillPayment.builder()
                    .user(users.get(0))
                    .vendor(vendors.get(3)) // Netflix
                    .amount(new BigDecimal("15.99"))
                    .currency("USD")
                    .reference("NETFLIX-123")
                    .status(BillPayment.BillPaymentStatus.COMPLETED)
                    .completedAt(Instant.now().minus(2, ChronoUnit.DAYS))
                    .build());

            // Jane's bill payments
            payments.add(BillPayment.builder()
                    .user(users.get(1))
                    .vendor(vendors.get(1)) // AT&T
                    .amount(new BigDecimal("89.99"))
                    .currency("USD")
                    .reference("ATT-456789")
                    .status(BillPayment.BillPaymentStatus.COMPLETED)
                    .completedAt(Instant.now().minus(7, ChronoUnit.DAYS))
                    .build());

            // Alice's bill payment
            payments.add(BillPayment.builder()
                    .user(users.get(2))
                    .vendor(vendors.get(2)) // Comcast
                    .amount(new BigDecimal("79.99"))
                    .currency("USD")
                    .reference("XFIN-789456")
                    .status(BillPayment.BillPaymentStatus.PENDING)
                    .build());
        }

        return payments;
    }

    private List<Transaction> createTransactions(List<User> users) {
        List<Transaction> transactions = new ArrayList<>();

        if (users.size() >= 5) {
            // P2P Transaction: John -> Jane
            transactions.add(Transaction.builder()
                    .sender(users.get(0))
                    .recipient(users.get(1))
                    .transferType(Transaction.TransferType.P2P)
                    .amountSent(new BigDecimal("50.00"))
                    .sentCurrency("USD")
                    .amountReceived(new BigDecimal("50.00"))
                    .receivedCurrency("USD")
                    .exchangeRate(BigDecimal.ONE)
                    .transactionFee(new BigDecimal("0.00"))
                    .transactionFeePercentage(new BigDecimal("0.0000"))
                    .paymentMethod("WEEZEEP_WALLET")
                    .deliveryMethod("INSTANT")
                    .status(Transaction.TransactionStatus.COMPLETED)
                    .completedAt(Instant.now().minus(3, ChronoUnit.DAYS))
                    .build());

            // P2P Transaction: Jane -> Alice
            transactions.add(Transaction.builder()
                    .sender(users.get(1))
                    .recipient(users.get(2))
                    .transferType(Transaction.TransferType.P2P)
                    .amountSent(new BigDecimal("100.00"))
                    .sentCurrency("USD")
                    .amountReceived(new BigDecimal("85.00"))
                    .receivedCurrency("GBP")
                    .exchangeRate(new BigDecimal("0.85"))
                    .transactionFee(new BigDecimal("2.50"))
                    .transactionFeePercentage(new BigDecimal("0.0250"))
                    .paymentMethod("WEEZEEP_WALLET")
                    .deliveryMethod("INSTANT")
                    .status(Transaction.TransactionStatus.COMPLETED)
                    .completedAt(Instant.now().minus(1, ChronoUnit.DAYS))
                    .build());

            // International Transaction: Alice -> External
            transactions.add(Transaction.builder()
                    .sender(users.get(2))
                    .transferType(Transaction.TransferType.INTERNATIONAL)
                    .recipientName("Maria Garcia")
                    .recipientPhone("+525551234567")
                    .recipientCountryCode("MX")
                    .amountSent(new BigDecimal("200.00"))
                    .sentCurrency("GBP")
                    .amountReceived(new BigDecimal("4800.00"))
                    .receivedCurrency("MXN")
                    .exchangeRate(new BigDecimal("24.00"))
                    .transactionFee(new BigDecimal("5.00"))
                    .transactionFeePercentage(new BigDecimal("0.0250"))
                    .forexMargin(new BigDecimal("2.00"))
                    .forexMarginPercentage(new BigDecimal("0.0100"))
                    .paymentMethod("BANK_ACCOUNT")
                    .deliveryMethod("BANK_TRANSFER")
                    .status(Transaction.TransactionStatus.PROCESSING)
                    .build());

            // P2P Transaction: Emma -> Bob
            transactions.add(Transaction.builder()
                    .sender(users.get(4))
                    .recipient(users.get(3))
                    .transferType(Transaction.TransferType.P2P)
                    .amountSent(new BigDecimal("75.00"))
                    .sentCurrency("CAD")
                    .amountReceived(new BigDecimal("1350.00"))
                    .receivedCurrency("MXN")
                    .exchangeRate(new BigDecimal("18.00"))
                    .transactionFee(new BigDecimal("1.50"))
                    .transactionFeePercentage(new BigDecimal("0.0200"))
                    .paymentMethod("WEEZEEP_WALLET")
                    .deliveryMethod("INSTANT")
                    .status(Transaction.TransactionStatus.COMPLETED)
                    .completedAt(Instant.now().minus(6, ChronoUnit.HOURS))
                    .build());

            // Failed Transaction
            transactions.add(Transaction.builder()
                    .sender(users.get(0))
                    .recipient(users.get(4))
                    .transferType(Transaction.TransferType.P2P)
                    .amountSent(new BigDecimal("25.00"))
                    .sentCurrency("USD")
                    .amountReceived(new BigDecimal("32.50"))
                    .receivedCurrency("CAD")
                    .exchangeRate(new BigDecimal("1.30"))
                    .transactionFee(new BigDecimal("0.50"))
                    .transactionFeePercentage(new BigDecimal("0.0200"))
                    .paymentMethod("DEBIT_CARD")
                    .deliveryMethod("INSTANT")
                    .status(Transaction.TransactionStatus.FAILED)
                    .build());
        }

        return transactions;
    }

    private List<MoneyRequest> createMoneyRequests(List<User> users) {
        List<MoneyRequest> requests = new ArrayList<>();

        if (users.size() >= 4) {
            // Jane requests from John
            requests.add(MoneyRequest.builder()
                    .requester(users.get(1))
                    .recipient(users.get(0))
                    .fixedAmount(new BigDecimal("30.00"))
                    .currency("USD")
                    .notes("Lunch payment")
                    .status(MoneyRequest.MoneyRequestStatus.PENDING)
                    .build());

            // Bob requests from Alice
            requests.add(MoneyRequest.builder()
                    .requester(users.get(3))
                    .recipient(users.get(2))
                    .fixedAmount(new BigDecimal("50.00"))
                    .currency("USD")
                    .notes("Concert tickets")
                    .status(MoneyRequest.MoneyRequestStatus.COMPLETED)
                    .completedAt(Instant.now().minus(2, ChronoUnit.HOURS))
                    .build());

            // Emma requests from Jane
            requests.add(MoneyRequest.builder()
                    .requester(users.get(4))
                    .recipient(users.get(1))
                    .fixedAmount(new BigDecimal("100.00"))
                    .currency("USD")
                    .notes("Dinner bill split")
                    .status(MoneyRequest.MoneyRequestStatus.COMPLETED)
                    .completedAt(Instant.now().minus(1, ChronoUnit.DAYS))
                    .build());

            // Cancelled request
            requests.add(MoneyRequest.builder()
                    .requester(users.get(0))
                    .recipient(users.get(3))
                    .fixedAmount(new BigDecimal("20.00"))
                    .currency("USD")
                    .notes("Coffee")
                    .status(MoneyRequest.MoneyRequestStatus.CANCELLED)
                    .build());
        }

        return requests;
    }

    private List<CashbackOffer> createCashbackOffers() {
        List<CashbackOffer> offers = new ArrayList<>();

        Instant now = Instant.now();

        offers.add(CashbackOffer.builder()
                .title("Welcome Bonus")
                .description("Get 5% cashback on your first 5 transactions!")
                .cashbackPercentage(new BigDecimal("5.00"))
                .minTransactionAmount(new BigDecimal("10.00"))
                .maxCashbackAmount(new BigDecimal("25.00"))
                .isActive(true)
                .startDate(now.minus(30, ChronoUnit.DAYS))
                .endDate(now.plus(30, ChronoUnit.DAYS))
                .applicableCountry("US")
                .build());

        offers.add(CashbackOffer.builder()
                .title("Bill Payment Rewards")
                .description("Earn 3% cashback on all bill payments")
                .cashbackPercentage(new BigDecimal("3.00"))
                .minTransactionAmount(new BigDecimal("20.00"))
                .maxCashbackAmount(new BigDecimal("15.00"))
                .isActive(true)
                .startDate(now.minus(15, ChronoUnit.DAYS))
                .endDate(now.plus(45, ChronoUnit.DAYS))
                .build());

        offers.add(CashbackOffer.builder()
                .title("International Transfer Bonus")
                .description("2% cashback on international transfers over $100")
                .cashbackPercentage(new BigDecimal("2.00"))
                .minTransactionAmount(new BigDecimal("100.00"))
                .maxCashbackAmount(new BigDecimal("50.00"))
                .isActive(true)
                .startDate(now)
                .endDate(now.plus(60, ChronoUnit.DAYS))
                .build());

        offers.add(CashbackOffer.builder()
                .title("Weekend Special")
                .description("Limited weekend offer - 10% cashback!")
                .cashbackPercentage(new BigDecimal("10.00"))
                .minTransactionAmount(new BigDecimal("50.00"))
                .maxCashbackAmount(new BigDecimal("20.00"))
                .isActive(false)
                .startDate(now.minus(10, ChronoUnit.DAYS))
                .endDate(now.minus(3, ChronoUnit.DAYS))
                .build());

        return offers;
    }

    private List<RewardAccount> createRewardAccounts(List<User> users) {
        List<RewardAccount> accounts = new ArrayList<>();

        for (int i = 0; i < users.size(); i++) {
            accounts.add(RewardAccount.builder()
                    .user(users.get(i))
                    .totalPoints(new BigDecimal(250 + (i * 100)))
                    .currentPoints(new BigDecimal(250 + (i * 100)))
                    .totalTransactions(10 + (i * 5))
                    .totalReferrals(i)
                    .totalCashbackEarned(new BigDecimal(50 + (i * 25)))
                    .build());
        }

        return accounts;
    }

    private List<Referral> createReferrals(List<User> users) {
        List<Referral> referrals = new ArrayList<>();

        if (users.size() >= 5) {
            // John referred Jane
            referrals.add(Referral.builder()
                    .referrer(users.get(0))
                    .referredUser(users.get(1))
                    .referralCode("JOHN2024")
                    .isCompleted(true)
                    .pointsEarned(new BigDecimal("10.00"))
                    .completedAt(Instant.now().minus(15, ChronoUnit.DAYS))
                    .build());

            // Jane referred Alice
            referrals.add(Referral.builder()
                    .referrer(users.get(1))
                    .referredUser(users.get(2))
                    .referralCode("JANE2024")
                    .isCompleted(true)
                    .pointsEarned(new BigDecimal("10.00"))
                    .completedAt(Instant.now().minus(10, ChronoUnit.DAYS))
                    .build());

            // Alice referred Bob (not completed)
            referrals.add(Referral.builder()
                    .referrer(users.get(2))
                    .referredUser(users.get(3))
                    .referralCode("ALICE2024")
                    .isCompleted(false)
                    .pointsEarned(BigDecimal.ZERO)
                    .build());

            // Emma was referred but not completed
            referrals.add(Referral.builder()
                    .referrer(users.get(0))
                    .referredUser(users.get(4))
                    .referralCode("JOHN2024OLD")
                    .isCompleted(false)
                    .pointsEarned(BigDecimal.ZERO)
                    .build());
        }

        return referrals;
    }
}

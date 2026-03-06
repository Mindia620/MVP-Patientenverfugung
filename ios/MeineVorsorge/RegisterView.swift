import SwiftUI

struct RegisterView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @Environment(\.dismiss) var dismiss
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""

    var passwordsMatch: Bool { password == confirmPassword }
    var isValid: Bool { !email.isEmpty && password.count >= 8 && passwordsMatch }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    Image(systemName: "person.badge.plus.fill")
                        .font(.system(size: 56))
                        .foregroundColor(.blue)
                        .padding(.top, 32)

                    Text("Konto erstellen")
                        .font(.title)
                        .fontWeight(.bold)

                    VStack(spacing: 16) {
                        FormFieldView(label: "E-Mail", placeholder: "ihre@email.de",
                                      text: $email, keyboardType: .emailAddress)

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Passwort (mind. 8 Zeichen)")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                            SecureField("Passwort", text: $password)
                                .padding(12)
                                .background(Color(.systemGray6))
                                .cornerRadius(8)
                        }

                        VStack(alignment: .leading, spacing: 6) {
                            Text("Passwort bestätigen")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                            SecureField("Passwort wiederholen", text: $confirmPassword)
                                .padding(12)
                                .background(Color(.systemGray6))
                                .cornerRadius(8)
                            if !confirmPassword.isEmpty && !passwordsMatch {
                                Text("Passwörter stimmen nicht überein")
                                    .font(.caption)
                                    .foregroundColor(.red)
                            }
                        }
                    }
                    .padding(.horizontal)

                    if let error = authViewModel.errorMessage {
                        ErrorBanner(message: error)
                    }

                    PrimaryButton(
                        title: "Registrieren",
                        action: { Task { await authViewModel.register(email: email, password: password) } },
                        isLoading: authViewModel.isLoading,
                        isDisabled: !isValid
                    )
                    .padding(.horizontal)
                    .padding(.bottom, 32)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Schließen") { dismiss() }
                }
            }
            .onChange(of: authViewModel.isAuthenticated) { _, isAuth in
                if isAuth { dismiss() }
            }
        }
    }
}

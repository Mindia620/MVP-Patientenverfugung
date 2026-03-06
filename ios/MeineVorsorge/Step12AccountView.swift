import SwiftUI

struct Step12AccountView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var email = ""
    @State private var password = ""
    @State private var isRegistering = true

    var isValid: Bool { !email.isEmpty && password.count >= 8 }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Konto erstellen / Anmelden")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Speichern Sie Ihre Dokumente sicher in Ihrem persönlichen Konto.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                // Already logged in
                if authViewModel.isAuthenticated {
                    VStack(spacing: 12) {
                        Image(systemName: "checkmark.seal.fill")
                            .font(.system(size: 48))
                            .foregroundColor(.green)
                        Text("Sie sind bereits angemeldet als:")
                            .foregroundColor(.secondary)
                        Text(authViewModel.currentUser?.email ?? "")
                            .font(.headline)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                } else {
                    // Tabs
                    Picker("", selection: $isRegistering) {
                        Text("Neu registrieren").tag(true)
                        Text("Anmelden").tag(false)
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal)

                    VStack(spacing: 16) {
                        FormFieldView(label: "E-Mail", placeholder: "ihre@email.de",
                                      text: $email, keyboardType: .emailAddress)
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Passwort \(isRegistering ? "(mind. 8 Zeichen)" : "")")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                            SecureField("Passwort", text: $password)
                                .padding(12)
                                .background(Color(.systemGray6))
                                .cornerRadius(8)
                        }
                    }
                    .padding(.horizontal)

                    if let error = authViewModel.errorMessage {
                        ErrorBanner(message: error)
                    }

                    PrimaryButton(
                        title: isRegistering ? "Registrieren & Weiter" : "Anmelden & Weiter",
                        action: {
                            Task {
                                if isRegistering {
                                    await authViewModel.register(email: email, password: password)
                                } else {
                                    await authViewModel.login(email: email, password: password)
                                }
                                if authViewModel.isAuthenticated {
                                    await wizard.syncDraftToServer()
                                    wizard.goNext()
                                }
                            }
                        },
                        isLoading: authViewModel.isLoading,
                        isDisabled: !isValid
                    )
                    .padding(.horizontal)

                    Button("Überspringen – ohne Konto fortfahren") {
                        wizard.goNext()
                    }
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity)
                }
            }
        }

        if authViewModel.isAuthenticated {
            WizardNavButtons(
                onBack: { wizard.goBack() },
                onNext: { wizard.goNext() },
                nextTitle: "Weiter zu Dokumenten"
            )
        } else {
            WizardNavButtons(
                onBack: { wizard.goBack() },
                onNext: { wizard.goNext() },
                nextTitle: "Ohne Konto weiter"
            )
        }
    }
}

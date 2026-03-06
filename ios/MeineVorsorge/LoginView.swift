import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @Environment(\.dismiss) var dismiss
    @State private var email = ""
    @State private var password = ""
    @State private var showRegister = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    Image(systemName: "heart.text.square.fill")
                        .font(.system(size: 56))
                        .foregroundColor(.blue)
                        .padding(.top, 32)

                    Text("Anmelden")
                        .font(.title)
                        .fontWeight(.bold)

                    VStack(spacing: 16) {
                        FormFieldView(label: "E-Mail", placeholder: "ihre@email.de",
                                      text: $email, keyboardType: .emailAddress)
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Passwort")
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
                        title: "Anmelden",
                        action: { Task { await authViewModel.login(email: email, password: password) } },
                        isLoading: authViewModel.isLoading,
                        isDisabled: email.isEmpty || password.isEmpty
                    )
                    .padding(.horizontal)

                    HStack {
                        Text("Noch kein Konto?")
                            .foregroundColor(.secondary)
                        Button("Registrieren") { showRegister = true }
                            .foregroundColor(.blue)
                    }
                    .font(.subheadline)
                }
                .padding(.bottom, 32)
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Schließen") { dismiss() }
                }
            }
            .sheet(isPresented: $showRegister) {
                RegisterView()
            }
            .onChange(of: authViewModel.isAuthenticated) { _, isAuth in
                if isAuth { dismiss() }
            }
        }
    }
}

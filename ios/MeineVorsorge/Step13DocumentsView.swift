import SwiftUI

struct Step13DocumentsView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var hasGenerated = false

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Image(systemName: "doc.badge.checkmark.fill")
                    .font(.system(size: 64))
                    .foregroundColor(.blue)
                    .padding(.top, 32)

                Text("Ihre Dokumente")
                    .font(.title2)
                    .fontWeight(.bold)

                if wizard.isLoading {
                    VStack(spacing: 12) {
                        ProgressView()
                            .scaleEffect(1.5)
                        Text("Dokumente werden erstellt…")
                            .foregroundColor(.secondary)
                    }
                    .padding()
                } else if let package = wizard.generatedPackage {
                    // Generated successfully
                    VStack(spacing: 12) {
                        Image(systemName: "checkmark.circle.fill")
                            .font(.system(size: 48))
                            .foregroundColor(.green)
                        Text("Dokumente erfolgreich erstellt!")
                            .font(.headline)

                        ForEach(package.documents) { doc in
                            HStack {
                                Image(systemName: "doc.fill")
                                    .foregroundColor(.blue)
                                Text(DocumentTypeKey(rawValue: doc.type.rawValue)?.displayName ?? doc.type.rawValue)
                                    .font(.subheadline)
                                Spacer()
                                if doc.status == "GENERATED" {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(.green)
                                }
                            }
                            .padding()
                            .background(Color(.systemGray6))
                            .cornerRadius(8)
                        }

                        if !authViewModel.isAuthenticated {
                            Text("Erstellen Sie ein Konto, um Ihre Dokumente dauerhaft zu speichern und als PDF herunterzuladen.")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .multilineTextAlignment(.center)
                                .padding()
                                .background(Color.orange.opacity(0.1))
                                .cornerRadius(10)
                        }
                    }
                } else {
                    // Not yet generated
                    VStack(spacing: 16) {
                        Text("Ihr Assistent ist abgeschlossen. Klicken Sie unten, um Ihre persönlichen Vorsorgedokumente zu erstellen.")
                            .multilineTextAlignment(.center)
                            .foregroundColor(.secondary)
                            .padding(.horizontal)

                        if let types = wizard.draft.selectedDocumentTypes {
                            VStack(spacing: 8) {
                                ForEach(types) { type in
                                    HStack {
                                        Image(systemName: "doc.text.fill")
                                            .foregroundColor(.blue)
                                        Text(type.displayName)
                                    }
                                    .padding(.horizontal)
                                }
                            }
                        }

                        if let error = wizard.errorMessage {
                            ErrorBanner(message: error)
                        }

                        if authViewModel.isAuthenticated {
                            PrimaryButton(title: "Dokumente erstellen") {
                                Task { await wizard.generateDocuments() }
                            }
                            .padding(.horizontal)
                        } else {
                            VStack(spacing: 8) {
                                Text("Bitte melden Sie sich an, um Dokumente zu generieren.")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                    .multilineTextAlignment(.center)
                                Text("(Im vorigen Schritt können Sie sich anmelden oder registrieren.)")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            .padding()
                        }
                    }
                }
            }
        }

        WizardNavButtons(
            onBack: { wizard.goBack() },
            onNext: {
                wizard.reset()
                // Navigation back to home is handled by ContentView observing the reset
            },
            nextTitle: wizard.generatedPackage != nil ? "Fertig" : "Zurück zum Start"
        )
    }
}

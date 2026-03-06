import SwiftUI

struct HomeView: View {
    let onStartWizard: () -> Void
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var showLogin = false
    @State private var showRegister = false

    var body: some View {
        ScrollView {
            VStack(spacing: 32) {
                // Hero
                VStack(spacing: 16) {
                    Image(systemName: "heart.text.square.fill")
                        .font(.system(size: 72))
                        .foregroundColor(.blue)
                    Text("Meine Vorsorge")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    Text("Erstellen Sie schnell und einfach Ihre persönlichen Vorsorgedokumente:\nPatientenverfügung, Vorsorgevollmacht und Betreuungsverfügung.")
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                .padding(.top, 48)

                // Feature highlights
                VStack(spacing: 16) {
                    FeatureRow(icon: "doc.text.fill", color: .blue,
                               title: "Rechtssichere Dokumente",
                               description: "Alle Dokumente erfüllen die deutschen gesetzlichen Anforderungen.")
                    FeatureRow(icon: "lock.shield.fill", color: .green,
                               title: "Datenschutz",
                               description: "Ihre Daten werden verschlüsselt gespeichert und nicht weitergegeben.")
                    FeatureRow(icon: "person.2.fill", color: .orange,
                               title: "Vertrauensperson",
                               description: "Bestimmen Sie eine Person Ihres Vertrauens für Notfälle.")
                    FeatureRow(icon: "qrcode", color: .purple,
                               title: "Notfallzugang",
                               description: "Über einen QR-Code können Ärzte im Notfall Ihre Verfügung abrufen.")
                }
                .padding(.horizontal)

                // CTA
                VStack(spacing: 12) {
                    PrimaryButton(title: "Jetzt starten", action: onStartWizard)
                        .padding(.horizontal)

                    HStack(spacing: 4) {
                        Text("Bereits registriert?")
                            .foregroundColor(.secondary)
                        Button("Anmelden") { showLogin = true }
                            .foregroundColor(.blue)
                    }
                    .font(.subheadline)
                }
                .padding(.bottom, 32)
            }
        }
        .navigationBarHidden(true)
        .sheet(isPresented: $showLogin) {
            LoginView()
        }
        .sheet(isPresented: $showRegister) {
            RegisterView()
        }
    }
}

private struct FeatureRow: View {
    let icon: String
    let color: Color
    let title: String
    let description: String

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
                .frame(width: 36)
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.headline)
                Text(description)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            Spacer()
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

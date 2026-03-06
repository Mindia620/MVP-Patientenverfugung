import SwiftUI

struct Step11SummaryView: View {
    @EnvironmentObject var wizard: WizardViewModel

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Zusammenfassung")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Prüfen Sie Ihre Angaben, bevor Sie die Dokumente erstellen.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                // Document types
                SummarySection(title: "Dokumente") {
                    if let types = wizard.draft.selectedDocumentTypes {
                        ForEach(types) { type in
                            SummaryRow(label: type.displayName, value: "✓")
                        }
                    }
                }

                // Personal info
                if let p = wizard.draft.personalInfo {
                    SummarySection(title: "Persönliche Angaben") {
                        SummaryRow(label: "Name", value: "\(p.firstName) \(p.lastName)")
                        SummaryRow(label: "Geburtsdatum", value: p.birthDate)
                        if !p.birthPlace.isEmpty {
                            SummaryRow(label: "Geburtsort", value: p.birthPlace)
                        }
                    }
                }

                // Address
                if let a = wizard.draft.address {
                    SummarySection(title: "Adresse") {
                        SummaryRow(label: "Anschrift", value: "\(a.street) \(a.houseNumber), \(a.postalCode) \(a.city)")
                    }
                }

                // Trusted person
                if let t = wizard.draft.trustedPerson, !t.firstName.isEmpty {
                    SummarySection(title: "Vertrauensperson") {
                        SummaryRow(label: "Name", value: "\(t.firstName) \(t.lastName)")
                        if !t.relationship.isEmpty {
                            SummaryRow(label: "Beziehung", value: t.relationship)
                        }
                        if !t.phone.isEmpty {
                            SummaryRow(label: "Telefon", value: t.phone)
                        }
                    }
                }

                // Medical prefs summary
                if let m = wizard.draft.medicalPrefs {
                    SummarySection(title: "Medizinische Wünsche") {
                        SummaryRow(label: "Schmerzlinderung", value: localizeYesNo(m.painManagement))
                        SummaryRow(label: "Künstl. Beatmung", value: localizeYesNo(m.artificialVentilation))
                        SummaryRow(label: "Reanimation", value: localizeYesNo(m.resuscitation))
                        SummaryRow(label: "Organspende", value: localizeYesNo(m.organDonation))
                    }
                }
            }
            .padding(.bottom)
        }

        WizardNavButtons(
            onBack: { wizard.goBack() },
            onNext: { wizard.goNext() },
            nextTitle: "Weiter zur Registrierung"
        )
    }

    private func localizeYesNo(_ value: String) -> String {
        switch value {
        case "yes": return "Ja"
        case "no": return "Nein"
        default: return "Unentschieden"
        }
    }
}

private struct SummarySection<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
            VStack(spacing: 0) {
                content
            }
            .background(Color(.systemGray6))
            .cornerRadius(10)
        }
        .padding(.horizontal)
    }
}

private struct SummaryRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .foregroundColor(.secondary)
                .font(.subheadline)
            Spacer()
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        Divider().padding(.horizontal, 12)
    }
}

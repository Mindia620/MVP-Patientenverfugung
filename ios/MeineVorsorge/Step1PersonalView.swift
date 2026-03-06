import SwiftUI

struct Step1PersonalView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var info = PersonalInfo()

    var isValid: Bool {
        !info.firstName.isEmpty && !info.lastName.isEmpty && !info.birthDate.isEmpty
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Persönliche Angaben")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Diese Angaben werden in Ihre Vorsorgedokumente eingetragen.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                VStack(spacing: 16) {
                    FormFieldView(label: "Vorname", placeholder: "Max", text: $info.firstName)
                    FormFieldView(label: "Nachname", placeholder: "Mustermann", text: $info.lastName)
                    FormFieldView(label: "Geburtsdatum", placeholder: "TT.MM.JJJJ", text: $info.birthDate)
                    FormFieldView(label: "Geburtsort", placeholder: "Berlin", text: $info.birthPlace)
                }
                .padding(.horizontal)
            }
        }

        WizardNavButtons(
            onBack: { wizard.goBack() },
            onNext: {
                wizard.setPersonalInfo(info)
                wizard.goNext()
            },
            nextDisabled: !isValid
        )
        .onAppear {
            if let existing = wizard.draft.personalInfo { info = existing }
        }
    }
}

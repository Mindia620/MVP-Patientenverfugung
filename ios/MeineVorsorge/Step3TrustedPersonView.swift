import SwiftUI

struct Step3TrustedPersonView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var person = TrustedPerson()

    var isValid: Bool {
        !person.firstName.isEmpty && !person.lastName.isEmpty
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Vertrauensperson")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Diese Person handelt in Ihrem Namen, wenn Sie selbst nicht mehr entscheidungsfähig sind.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                VStack(spacing: 16) {
                    FormFieldView(label: "Vorname", placeholder: "Erika", text: $person.firstName)
                    FormFieldView(label: "Nachname", placeholder: "Mustermann", text: $person.lastName)
                    FormFieldView(label: "Beziehung", placeholder: "z.B. Ehepartner, Kind", text: $person.relationship)
                    FormFieldView(label: "Telefon", placeholder: "+49 30 12345678",
                                  text: $person.phone, keyboardType: .phonePad)
                    FormFieldView(label: "E-Mail (optional)", placeholder: "erika@email.de",
                                  text: $person.email, keyboardType: .emailAddress)
                }
                .padding(.horizontal)
            }
        }

        WizardNavButtons(
            onBack: { wizard.goBack() },
            onNext: {
                wizard.setTrustedPerson(person)
                wizard.goNext()
            },
            nextDisabled: !isValid
        )
        .onAppear {
            if let existing = wizard.draft.trustedPerson { person = existing }
        }
    }
}

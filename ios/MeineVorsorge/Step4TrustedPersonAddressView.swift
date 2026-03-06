import SwiftUI

struct Step4TrustedPersonAddressView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var person = TrustedPerson()

    var isValid: Bool {
        !person.street.isEmpty && !person.postalCode.isEmpty && !person.city.isEmpty
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Adresse der Vertrauensperson")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Die Anschrift Ihrer Vertrauensperson für die offiziellen Dokumente.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                VStack(spacing: 16) {
                    HStack(spacing: 12) {
                        FormFieldView(label: "Straße", placeholder: "Musterstraße", text: $person.street)
                        FormFieldView(label: "Nr.", placeholder: "1", text: $person.houseNumber)
                            .frame(maxWidth: 80)
                    }
                    HStack(spacing: 12) {
                        FormFieldView(label: "PLZ", placeholder: "10115", text: $person.postalCode,
                                      keyboardType: .numberPad)
                            .frame(maxWidth: 100)
                        FormFieldView(label: "Stadt", placeholder: "Berlin", text: $person.city)
                    }
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

import SwiftUI

struct Step2AddressView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var address = AddressInfo()

    var isValid: Bool {
        !address.street.isEmpty && !address.postalCode.isEmpty && !address.city.isEmpty
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Ihre Adresse")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Ihre Wohnanschrift für die Dokumente.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                VStack(spacing: 16) {
                    HStack(spacing: 12) {
                        FormFieldView(label: "Straße", placeholder: "Musterstraße", text: $address.street)
                        FormFieldView(label: "Nr.", placeholder: "12", text: $address.houseNumber)
                            .frame(maxWidth: 80)
                    }
                    HStack(spacing: 12) {
                        FormFieldView(label: "PLZ", placeholder: "10115", text: $address.postalCode,
                                      keyboardType: .numberPad)
                            .frame(maxWidth: 100)
                        FormFieldView(label: "Stadt", placeholder: "Berlin", text: $address.city)
                    }
                }
                .padding(.horizontal)
            }
        }

        WizardNavButtons(
            onBack: { wizard.goBack() },
            onNext: {
                wizard.setAddress(address)
                wizard.goNext()
            },
            nextDisabled: !isValid
        )
        .onAppear {
            if let existing = wizard.draft.address { address = existing }
        }
    }
}

import SwiftUI

struct Step10ValuesView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var values = PersonalValues()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Persönliche Werte & Wünsche")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Teilen Sie Ihre persönlichen Werte mit, die bei medizinischen Entscheidungen berücksichtigt werden sollen.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                VStack(spacing: 20) {
                    // Toggles
                    VStack(spacing: 12) {
                        Toggle("Lebensqualität ist wichtiger als Länge", isOn: $values.qualityOverLength)
                        Toggle("Selbstständigkeit ist mir sehr wichtig", isOn: $values.independenceImportant)
                        Toggle("Sozialer Kontakt ist mir wichtig", isOn: $values.socialContact)
                    }
                    .padding()
                    .background(Color(.systemGray6))
                    .cornerRadius(12)

                    // Where to be cared for
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Im Pflegefall möchte ich versorgt werden:")
                            .font(.subheadline)
                            .fontWeight(.medium)
                        Picker("", selection: $values.homeOrHospital) {
                            Text("Zuhause").tag("home")
                            Text("Pflegeheim").tag("nursing_home")
                            Text("Hospiz").tag("hospice")
                            Text("Keine Präferenz").tag("no_preference")
                        }
                        .pickerStyle(.segmented)
                    }

                    // Religious belief
                    FormFieldView(
                        label: "Religiöse / weltanschauliche Überzeugungen (optional)",
                        placeholder: "z.B. evangelisch-christlich, humanistisch...",
                        text: $values.religiousBelief
                    )

                    // Additional wishes
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Weitere persönliche Wünsche (optional)")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        TextEditor(text: $values.additionalWishes)
                            .frame(minHeight: 100)
                            .padding(8)
                            .background(Color(.systemGray6))
                            .cornerRadius(8)
                    }
                }
                .padding(.horizontal)
            }
        }

        WizardNavButtons(
            onBack: { wizard.goBack() },
            onNext: {
                wizard.setPersonalValues(values)
                wizard.goNext()
            }
        )
        .onAppear {
            if let existing = wizard.draft.personalValues { values = existing }
        }
    }
}

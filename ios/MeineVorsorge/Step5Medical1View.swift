import SwiftUI

struct Step5Medical1View: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var prefs = MedicalPrefs()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Medizinische Wünsche – Teil 1")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Legen Sie fest, welche medizinischen Maßnahmen Sie wünschen oder ablehnen.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                VStack(spacing: 20) {
                    MedicalToggle(
                        label: "Schmerzlinderung (Palliativmedizin)",
                        tooltip: "Maßnahmen zur Linderung von Schmerzen und Leiden",
                        value: $prefs.painManagement
                    )
                    MedicalToggle(
                        label: "Palliative Sedierung",
                        tooltip: "Tiefe Sedierung bei unerträglichen Symptomen am Lebensende",
                        value: $prefs.palliativeCare
                    )
                    MedicalToggle(
                        label: "Künstliche Ernährung",
                        tooltip: "Ernährung über Sonde oder Infusion",
                        value: $prefs.artificialNutrition
                    )
                    MedicalToggle(
                        label: "Künstliche Beatmung",
                        tooltip: "Maschinelle Unterstützung der Atmung",
                        value: $prefs.artificialVentilation
                    )
                }
                .padding(.horizontal)
            }
        }

        WizardNavButtons(
            onBack: { wizard.goBack() },
            onNext: {
                wizard.setMedicalPrefs(prefs)
                wizard.goNext()
            }
        )
        .onAppear {
            if let existing = wizard.draft.medicalPrefs { prefs = existing }
        }
    }
}

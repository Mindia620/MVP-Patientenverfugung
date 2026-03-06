import SwiftUI

struct Step6Medical2View: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var prefs = MedicalPrefs()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Medizinische Wünsche – Teil 2")
                        .font(.title2)
                        .fontWeight(.bold)
                    Text("Weitere medizinische Maßnahmen nach Ihren Wünschen.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                VStack(spacing: 20) {
                    MedicalToggle(
                        label: "Wiederbelebung (Reanimation)",
                        tooltip: "Herz-Lungen-Wiederbelebung bei Herzstillstand",
                        value: $prefs.resuscitation
                    )
                    MedicalToggle(
                        label: "Dialyse",
                        tooltip: "Blutwäsche bei Nierenversagen",
                        value: $prefs.dialysis
                    )
                    MedicalToggle(
                        label: "Antibiotika",
                        tooltip: "Behandlung von Infektionskrankheiten",
                        value: $prefs.antibiotics
                    )
                    MedicalToggle(
                        label: "Bluttransfusionen",
                        tooltip: "Übertragung von Blut oder Blutprodukten",
                        value: $prefs.bloodTransfusion
                    )
                    MedicalToggle(
                        label: "Organspende",
                        tooltip: "Bereitstellung von Organen nach dem Tod",
                        value: $prefs.organDonation
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

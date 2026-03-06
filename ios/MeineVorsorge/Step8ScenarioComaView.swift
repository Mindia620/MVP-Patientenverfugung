import SwiftUI

struct Step8ScenarioComaView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var scenarios = Scenarios()

    private let options = [
        ("continue", "Weiter behandeln", "Alle Maßnahmen zur Aufrechterhaltung der Lebensfunktionen einsetzen."),
        ("withhold", "Maßnahmen zurückhalten", "Keine neuen lebenserhaltenden Maßnahmen beginnen."),
        ("withdraw", "Maßnahmen beenden", "Bereits begonnene Maßnahmen nach angemessener Zeit beenden.")
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 12) {
                        Image(systemName: "brain.head.profile")
                            .font(.title)
                            .foregroundColor(.orange)
                        Text("Szenario: Bewusstlosigkeit / Koma")
                            .font(.title2)
                            .fontWeight(.bold)
                    }
                    Text("Sie befinden sich in einem Koma oder dauerhafter Bewusstlosigkeit.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                VStack(alignment: .leading, spacing: 16) {
                    Text("Mit realistischer Rehabilitationschance:")
                        .font(.headline)
                        .padding(.horizontal)

                    ForEach(options, id: \.0) { (value, title, desc) in
                        SelectionCard(
                            title: title,
                            description: desc,
                            isSelected: scenarios.comaRehabChance == value,
                            action: { scenarios.comaRehabChance = value }
                        )
                    }
                    .padding(.horizontal)
                }

                VStack(alignment: .leading, spacing: 16) {
                    Text("Ohne realistische Rehabilitationschance:")
                        .font(.headline)
                        .padding(.horizontal)

                    ForEach(options, id: \.0) { (value, title, desc) in
                        SelectionCard(
                            title: title,
                            description: desc,
                            isSelected: scenarios.comaNoRehabChance == value,
                            action: { scenarios.comaNoRehabChance = value }
                        )
                    }
                    .padding(.horizontal)
                }
            }
        }

        WizardNavButtons(
            onBack: { wizard.goBack() },
            onNext: {
                wizard.setScenarios(scenarios)
                wizard.goNext()
            }
        )
        .onAppear {
            if let existing = wizard.draft.scenarios { scenarios = existing }
        }
    }
}

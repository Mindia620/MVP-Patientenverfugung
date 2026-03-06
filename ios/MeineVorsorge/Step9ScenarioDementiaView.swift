import SwiftUI

struct Step9ScenarioDementiaView: View {
    @EnvironmentObject var wizard: WizardViewModel
    @State private var scenarios = Scenarios()

    private let treatOptions = [
        ("continue", "Weiter behandeln", "Krankheiten aktiv behandeln."),
        ("comfort", "Komfortversorgung", "Fokus auf Wohlbefinden, keine lebensverlängernden Maßnahmen."),
        ("withhold", "Maßnahmen zurückhalten", "Auf lebenserhaltende Eingriffe verzichten.")
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: 12) {
                        Image(systemName: "person.fill.questionmark")
                            .font(.title)
                            .foregroundColor(.purple)
                        Text("Szenario: Demenz")
                            .font(.title2)
                            .fontWeight(.bold)
                    }
                    Text("Für den Fall einer fortgeschrittenen Demenz, bei der Sie sich selbst nicht mehr erkennen.")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
                .padding(.top)

                scenarioSection(
                    title: "Leichte Demenz:",
                    binding: $scenarios.dementiaMild
                )
                scenarioSection(
                    title: "Schwere Demenz:",
                    binding: $scenarios.dementiaSevere
                )
                scenarioSection(
                    title: "Aggressive Verhaltensweisen:",
                    binding: $scenarios.dementiaAggressive
                )
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

    @ViewBuilder
    private func scenarioSection(title: String, binding: Binding<String>) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(title)
                .font(.headline)
                .padding(.horizontal)
            ForEach(treatOptions, id: \.0) { (value, label, desc) in
                SelectionCard(
                    title: label,
                    description: desc,
                    isSelected: binding.wrappedValue == value,
                    action: { binding.wrappedValue = value }
                )
            }
            .padding(.horizontal)
        }
    }
}

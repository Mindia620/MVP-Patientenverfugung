import SwiftUI

struct DashboardView: View {
    @EnvironmentObject var authViewModel: AuthViewModel
    @EnvironmentObject var wizardViewModel: WizardViewModel
    @State private var packages: [DocumentPackage] = []
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var showNewWizard = false

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    ProgressView()
                } else if packages.isEmpty {
                    emptyState
                } else {
                    packageList
                }
            }
            .navigationTitle("Meine Dokumente")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showNewWizard = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Menu {
                        Text(authViewModel.currentUser?.email ?? "")
                        Divider()
                        Button(role: .destructive) {
                            Task { await authViewModel.logout() }
                        } label: {
                            Label("Abmelden", systemImage: "arrow.right.square")
                        }
                    } label: {
                        Image(systemName: "person.circle")
                    }
                }
            }
            .task { await loadPackages() }
            .refreshable { await loadPackages() }
            .sheet(isPresented: $showNewWizard) {
                WizardContainerView(onExit: { showNewWizard = false })
                    .environmentObject(wizardViewModel)
                    .environmentObject(authViewModel)
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 20) {
            Image(systemName: "doc.badge.plus")
                .font(.system(size: 64))
                .foregroundColor(.gray)
            Text("Noch keine Dokumente")
                .font(.title2)
                .fontWeight(.bold)
            Text("Erstellen Sie Ihre erste Vorsorgedokumentation.")
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            PrimaryButton(title: "Jetzt erstellen") {
                showNewWizard = true
            }
            .frame(maxWidth: 240)
        }
        .padding()
    }

    private var packageList: some View {
        List {
            if let error = errorMessage {
                ErrorBanner(message: error)
                    .listRowBackground(Color.clear)
            }
            ForEach(packages) { package in
                PackageRow(package: package)
            }
        }
        .listStyle(.insetGrouped)
    }

    private func loadPackages() async {
        isLoading = true
        do {
            packages = try await APIService.shared.listDocuments()
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}

private struct PackageRow: View {
    let package: DocumentPackage

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(package.label ?? "Vorsorgepaket")
                    .font(.headline)
                Spacer()
                StatusBadge(status: package.status)
            }
            Text(formatDate(package.createdAt))
                .font(.caption)
                .foregroundColor(.secondary)
            HStack(spacing: 6) {
                ForEach(package.documents) { doc in
                    Text(shortName(doc.type))
                        .font(.caption2)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.blue.opacity(0.1))
                        .foregroundColor(.blue)
                        .cornerRadius(4)
                }
            }
        }
        .padding(.vertical, 4)
    }

    private func formatDate(_ iso: String) -> String {
        let formatter = ISO8601DateFormatter()
        if let date = formatter.date(from: iso) {
            let display = DateFormatter()
            display.dateStyle = .medium
            display.locale = Locale(identifier: "de_DE")
            return display.string(from: date)
        }
        return iso
    }

    private func shortName(_ type: DocumentTypeKey) -> String {
        switch type {
        case .PATIENTENVERFUEGUNG: return "PV"
        case .VORSORGEVOLLMACHT: return "VV"
        case .BETREUUNGSVERFUEGUNG: return "BV"
        }
    }
}

private struct StatusBadge: View {
    let status: PackageStatus

    var body: some View {
        Text(statusText)
            .font(.caption)
            .fontWeight(.medium)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(statusColor.opacity(0.15))
            .foregroundColor(statusColor)
            .cornerRadius(6)
    }

    private var statusText: String {
        switch status {
        case .PROCESSING: return "In Bearbeitung"
        case .COMPLETED: return "Fertig"
        case .FAILED: return "Fehler"
        }
    }

    private var statusColor: Color {
        switch status {
        case .PROCESSING: return .orange
        case .COMPLETED: return .green
        case .FAILED: return .red
        }
    }
}

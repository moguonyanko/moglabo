//
//  graph.swift
//  Algorithm
//
// Reference:
// 「アルゴリズムとデータ構造」SoftbankCreative
//

import Foundation

private class Station: Equatable {
    private let name: String
    private var stations: [Station]
    init(name: String, stations: [Station]) {
        self.name = name
        self.stations = stations
    }
    convenience init(name: String) {
        self.init(name: name, stations: [Station]())
    }
    func add(station: Station) {
        let existStation = stations.contains { $0 == station }
        guard !existStation else {
            return
        }
        stations.append(station)
    }
    static func ==(lhs: Station, rhs: Station) -> Bool {
        return lhs.name == rhs.name && lhs.stations == rhs.stations
    }
    func getStationInfo() -> String {
        let result = stations.map {
            "->\($0.name) "
        }.joined()
        return "\(name) \(result)"
    }
}

private func printSampleStations() {
    let stations = [
        Station(name: "鎌倉"),
        Station(name: "藤沢"),
        Station(name: "横浜"),
        Station(name: "横須賀"),
        Station(name: "茅ヶ崎"),
        Station(name: "東京"),
    ]
    
    stations[0].add(station: stations[3])
    stations[0].add(station: stations[1])
    stations[0].add(station: stations[2])
    
    stations[1].add(station: stations[0])
    stations[1].add(station: stations[4])
    stations[1].add(station: stations[2])
    
    stations[2].add(station: stations[1])
    stations[2].add(station: stations[0])
    stations[2].add(station: stations[5])
    
    stations[3].add(station: stations[0])
    stations[4].add(station: stations[1])
    stations[5].add(station: stations[2])
    
    stations.forEach { print($0.getStationInfo()) }
}

struct Graph {
    static func main() {
        printSampleStations()
    }
}


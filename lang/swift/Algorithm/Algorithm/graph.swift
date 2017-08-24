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

private struct StationMatrix {
    private let matrix = [
        (stationName: "鎌倉", linkedStations: [0, 1, 1, 1, 0, 0]),
        (stationName: "藤沢", linkedStations: [1, 0, 1, 0, 1, 0]),
        (stationName: "横浜", linkedStations: [1, 1, 0, 0, 0, 1]),
        (stationName: "横須賀", linkedStations: [1, 0, 0, 0, 0, 0]),
        (stationName: "茅ヶ崎", linkedStations: [0, 1, 0, 0, 0, 0]),
        (stationName: "東京", linkedStations: [0, 0, 1, 0, 0, 0])
    ]
    var descriotion: String {
        var msg = [String]()
        for i in 0..<matrix.count {
            msg.append("\(matrix[i].stationName):")
            for j in 0..<matrix[i].linkedStations.count {
                if matrix[i].linkedStations[j] == 1 {
                    msg.append("->\(matrix[j].stationName) ")
                }
            }
            msg.append("\n")
        }
        return msg.joined()
    }
}

private func printStationMatrix() {
    let sm = StationMatrix()
    print(sm.descriotion)
}

private struct WeightStationMatrix {
    private let matrix = [
        (stationName: "横浜", linkedStations: [0, 12, 28, 0, 0, 0]),
        (stationName: "武蔵小杉", linkedStations: [12, 0, 10, 13, 0, 0]),
        (stationName: "品川", linkedStations: [28, 10, 0, 11, 7, 0]),
        (stationName: "渋谷", linkedStations: [0, 13, 11, 0, 0, 9]),
        (stationName: "新橋", linkedStations: [0, 0, 7, 0, 0, 4]),
        (stationName: "溜池山王", linkedStations: [0, 0, 0, 9, 4, 0])
    ]
    var descriotion: String {
        var msg = [String]()
        for i in 0..<matrix.count {
            msg.append("\(matrix[i].stationName):")
            for j in 0..<matrix[i].linkedStations.count {
                if matrix[i].linkedStations[j] > 0 {
                    let info = "->\(matrix[j].stationName)(\(matrix[i].linkedStations[j])分) "
                    msg.append(info)
                }
            }
            msg.append("\n")
        }
        return msg.joined()
    }
}

private func printWeightStationMatrix() {
    let wsm = WeightStationMatrix()
    print(wsm.descriotion)
}

struct Graph {
    static func main() {
        //printSampleStations()
        //printStationMatrix()
        printWeightStationMatrix()
    }
}


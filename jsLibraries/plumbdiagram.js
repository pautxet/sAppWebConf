function PlumbGrafic() {
    jsPlumb.reset();
    jsPlumb.ready(function () {
        if (ConEdiMode == "Con") {
            var cstyle = {//style for the connections of the flowchart
                isSource: true,
                isTarget: true,
                connector: ["Flowchart"],
                paintStyle: {
                    strokeStyle: "#FF7F50",
                    lineWidth: 4
                },
                endpoint: ["Rectangle", {width: 1, height: 1}],
                overlays: [
                    ["Arrow", {width: 15, length: 15, location: 1}]
                ],
            };
        }
        if ((ConEdiMode == "Edi") || (ConEdiMode == "NoEdi")) {
            var cstyle = {//style for the connections of the flowchart
                isSource: true,
                isTarget: true,
                connector: ["Flowchart"],
                paintStyle: {
                    strokeStyle: "#AAAEB3",
                    lineWidth: 4
                },
                endpoint: ["Rectangle", {width: 1, height: 1}],
                overlays: [
                    ["Arrow", {width: 15, length: 15, location: 1}]
                ],
            };
        }
        initboxid = 9998;
        finboxid = 9999;
        for (m = 0; m < idsInside.length; m++) {//creates all the diagram boxes for each Point
            esdelbloc = true;
            if (esdelbloc == true) {
                id = idsInside[m].split("-", 1);
                if ((ConEdiMode == "Edi") || (ConEdiMode == "NoEdi")) {
                    if (ConEdiMode == "Edi") {
                        jsPlumb.draggable("item" + id, {
                            containment: "parent" //to contain the div into the area
                        });
                        jsPlumb.setDraggable("item" + id, true);
                        document.getElementById("item" + id).style.cursor = "move";
                    } else if (ConEdiMode == "NoEdi") {
                        jsPlumb.draggable("item" + id, {
                            containment: "parent" //to contain the div into the area
                        });
                        jsPlumb.setDraggable("item" + id, false);
                        document.getElementById("item" + id).style.cursor = "default";
                    }
                } else if (ConEdiMode == "Con") {
                    jsPlumb.setDraggable("item" + id, false);
                    document.getElementById("item" + id).style.cursor = "default";
                }
            }
        }
        var id1, id2;
        if (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections) {
            c = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection;
        } else {
            c = [];
        }
        for (j = 0; j < c.length; j++) {
            esdelbloc = true;
            if (esdelbloc == true) {
                id1 = "item" + c[j].sourceId;
                id2 = "item" + c[j].endId;
                if (c[j].sourceId == o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]) {
                    id1 = "item" + 9998;
                }
                if (c[j].endId == o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"]) {
                    id2 = "item" + 9999;
                }
                connection = jsPlumb.connect({
                    source: id1,
                    target: id2,
                    anchors: ["Bottom", "Top"],
                }, cstyle);
                connection.bind("click", function (conn) {
                    if (ConEdiMode == "Con") {
                        for (t = 0; t < o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection.length; t++) {
                            sourceIdConnection = conn.sourceId.replace("item", "");
                            endIdConnection = conn.targetId.replace("item", "");
                            if ((sourceIdConnection == 9998) || (sourceIdConnection == 9999)) {
                                sourceIdConnection = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
                            }
                            if ((endIdConnection == 9998) || (endIdConnection == 9999)) {
                                endIdConnection = o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc]["@Id"];
                            }
                            if ((o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[t].sourceId == sourceIdConnection) && (o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection[t].endId == endIdConnection)) {
                                if (ConfiguratorMode == 'CBC') {
                                    OnConnectionDeleteCBC(o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection, t);
                                } else {
                                    o.BlocAssembly.AllBlocs.Bloc[idCurrentBloc].Connections.Connection.splice(t, 1);
                                }
                                jsPlumb.detach(conn);
                            }
                        }
                    } else {
                        OnSwConnectionMode();
                        document.getElementById("swConnection").checked = true;
                    }
                });
            }
        }
    });
}

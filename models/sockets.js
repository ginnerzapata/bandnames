const BandList = require("./band-list");

class Sockets {
  constructor(io) {
    this.io = io;
    this.bandList = new BandList();

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", (socket) => {
      console.log("Cliente Conectado");
      //Emitir al cliente conectado, todas las bandas actuales
      socket.emit("current-bands", this.bandList.getBands());

      //votar banda
      socket.on("vote-band", (id) => {
        this.bandList.increaseVotes(id);
        this.io.emit("current-bands", this.bandList.getBands());
      });

      //borrar banda
      socket.on("delete-band", (id) => {
        this.bandList.removeBand(id);
        this.io.emit("current-bands", this.bandList.getBands());
      });

      //actualizar nombre
      socket.on("update-name", ({ id, name }) => {
        this.bandList.changeBandName(id, name);
        this.io.emit("current-bands", this.bandList.getBands());
      });

      //crear banda
      socket.on("create-band", ({ name }) => {
        this.bandList.addBand(name);
        this.io.emit("current-bands", this.bandList.getBands());
      });
    });
  }
}

module.exports = Sockets;

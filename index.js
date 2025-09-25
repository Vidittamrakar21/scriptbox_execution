import express from 'express';
import cors from 'cors';
import morgan  from 'morgan';
import pty from 'node-pty';
import chokidar from 'chokidar'
import {Server as SocketServer} from 'socket.io';
import fs from 'fs/promises';
import { Buffer } from 'buffer';
import http from 'http';
import https from 'https';
import dotenv from 'dotenv';
dotenv.config(); 

import fetch from 'node-fetch';
import afs from 'fs';
import  AdmZip from 'adm-zip';


import apiroute   from './routes/app.js';


const app = express();



const server = http.createServer(app);



app.use(express.json());
app.use(cors({origin:"*"}));
app.use(morgan('tiny'));

const notallowedCommands = ['ls', 'cd','cd ../','cat']; // Add other allowed commands as needed


function isCommandAllowed(command) {
  const [cmd, ...args] = command.trim().split(' ');
  return notallowedCommands.includes(cmd);
}




var ptyProcess1 = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user',
   
    env: process.env
  });

var ptyProcess2 = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user',
   
    env: process.env
  });

var ptyProcess3 = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user',
   
    env: process.env
  });

var ptyProcess4 = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user',
   
    env: process.env
  });


var ptyProcess5 = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user',
   
    env: process.env
  });

  const io = new SocketServer({
   
        cors: '*',
        
    })

    
    io.attach(server);

    const watcher = chokidar.watch('./user', {
        ignored: /node_modules/, 
        persistent: true,
      });

      watcher
      .on('add', path => io.emit('file:refresh'))
      .on('change', path => io.emit('file:refresh'))
      .on('unlink', path => io.emit('file:refresh'))
      .on('addDir', path => io.emit('file:refresh'))
      .on('unlinkDir', path => io.emit('file:refresh'));  

io.on('connection', (socket)=>{
   
    console.log('socket connected' , socket.id);

    // socket.on('terminal:write',({data , term})=>{
      
    //     if(term  === 1){
    //         ptyProcess1.write(data);
    //     }
    //     else if(term  === 2){
    //         ptyProcess2.write(data);
    //     }
    //     else if(term  === 3){
    //         ptyProcess3.write(data);
    //     }
    //     else if(term  === 4){
    //         ptyProcess4.write(data);
    //     }
    //     else{
    //         ptyProcess5.write(data);
    //     }

        
    // })

    socket.on('terminal1:write',({data}) =>{
     

        ptyProcess1.write(data);
      
    })

    socket.on('terminal2:write',({data}) =>{
    
        ptyProcess2.write(data);
     
    })

    socket.on('terminal3:write',({data}) =>{
      ptyProcess3.write(data);
    })

    socket.on('terminal4:write',({data}) =>{
      ptyProcess4.write(data);
    })

    socket.on('terminal5:write',({data}) =>{
      ptyProcess5.write(data);
    })

    socket.on('file:changed',async ({path, content})=>{
        console.log("path", path)
        console.log("content", content)
      await fs.writeFile(`./user${path}`, content)
       
    })

  //   socket.on('connect-room', async ({room})=>{
  //     await socket.join(room);

  //     io.to(room).emit('user-joinded', `${socket.id} joined room ${room}`);
  //     console.log(`${socket.id} joined room ${room}`);

  // })

    socket.on('send:code', ({room, code})=>{
        
        socket.to(room).emit('recieve:code', code);
    })

    
})

ptyProcess1.onData( data =>{
    console.log(data)
    io.emit('terminal1:data',{tdata: data , id:1})

  })


ptyProcess2.onData( data =>{
    console.log(data)
    io.emit('terminal2:data',{tdata: data , id:2})
  })


ptyProcess3.onData( data =>{
    console.log(data)
    io.emit('terminal3:data',{tdata: data , id:3})
  })


ptyProcess4.onData( data =>{
    console.log(data)
    io.emit('terminal4:data',{tdata: data , id:4})
  })


ptyProcess5.onData( data =>{
    console.log(data)
    io.emit('terminal5:data',{tdata: data , id:5})
  })


app.get('/', (req,res)=>{
    try {
        
        res.json({message: " Server is running !"})
    } catch (error) {
        res.json(error)
    }
})

app.get('/healthy', (req,res)=>{
    try {
        
        res.json({message: "Server is healthy."})
    } catch (error) {
        res.json(error)
    }
})


app.post('/fetchtemp' , async (req,res)=>{
  try {

    const {temp} = req.body;
    
  const response = await fetch(`http://localhost:5500/api/fetchtemp/${temp}`);
  const arraybuffer = await response.arrayBuffer();
  
  const buffer = Buffer.from(arraybuffer);
  afs.writeFileSync(`${temp}.zip`, buffer);

  // Extract the zip file
  const zip = new AdmZip(`${temp}.zip`);
  zip.extractAllTo(`./template`, true);  // Extracts to a user working directory
  res.json({message: "fetched"});
  console.log('Template fetched and extracted');
  } catch (error) {
    
    res.json(error);
  }
});



app.use('/api', apiroute);



server.listen(8082, ()=>{

    

    console.log("server started")
})



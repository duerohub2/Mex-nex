"use client";
import { useEffect, useRef } from "react";
type AgentVisual = { name: string; role: string; x: number; y: number; texture: string; status: string };
const AGENTS: AgentVisual[] = [
 {name:"NEX",role:"Engineering",x:610,y:410,texture:"dev-front",status:"Mengerjakan task"},
 {name:"MIRA",role:"Research",x:920,y:535,texture:"dev-side",status:"Menganalisis"},
 {name:"ATLAS",role:"Operations",x:1120,y:390,texture:"dev-two",status:"Siaga"},
 {name:"KIRA",role:"Creative",x:420,y:585,texture:"employee",status:"Mendesain"},
];
export function PixelHQPreview() {
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let game: import("phaser").Game|undefined; let disposed=false;
  void import("phaser").then((Phaser)=>{
   if(disposed||!host.current)return;
   class PixelOfficeScene extends Phaser.Scene {
    private dragPoint?:{x:number;y:number};
    constructor(){super("mex-nex-pixel-hq");}
    preload(){
     this.load.image("dev-front","/office-assets/claude-office/characters/dev-1-front-left.png");
     this.load.image("dev-side","/office-assets/claude-office/characters/dev-1-front-right.png");
     this.load.image("dev-two","/office-assets/claude-office/characters/dev-2-front-left.png");
     this.load.image("employee","/office-assets/claude-office/characters/employee-1-front-left.png");
     this.load.image("desk","/office-assets/claude-office/furniture/standing-desk-left-front.png");
     this.load.image("plant","/office-assets/claude-office/decoration/monstera-plant.png");
     this.load.image("whiteboard","/office-assets/claude-office/decoration/white-board.png");
     this.load.image("coffee","/office-assets/claude-office/appliances/coffee-on.png");
     this.load.image("tasks","/office-assets/claude-office/culture/todo-board.png");
    }
    create(){
     const g=this.add.graphics();
     g.fillStyle(0x17252a,1).fillRect(0,0,1600,1000);
     g.fillStyle(0x344b4a,1).fillPoints([new Phaser.Geom.Point(800,55),new Phaser.Geom.Point(1515,425),new Phaser.Geom.Point(800,865),new Phaser.Geom.Point(85,425)],true);
     g.lineStyle(2,0x668078,0.35);
     for(let i=-10;i<=10;i++){const y=425+i*35;g.lineBetween(800-(y-425)*1.93,y,800+(y-425)*1.93,y);}
     for(let i=0;i<=20;i++){const x=110+i*69;g.lineBetween(x,425-Math.abs(x-800)*0.518,x,425+Math.abs(x-800)*0.518);}
     this.zone(g,420,365,430,245,0x6b8b75,"ENGINEERING");
     this.zone(g,1040,365,390,245,0x6686a0,"OPERATIONS");
     this.zone(g,465,650,380,190,0x987b9b,"CREATIVE STUDIO");
     this.zone(g,1080,650,390,190,0xc18b5c,"COLLABORATION");
     g.fillStyle(0x263d42,0.98);
     g.fillPoints([new Phaser.Geom.Point(800,55),new Phaser.Geom.Point(1515,425),new Phaser.Geom.Point(1515,390),new Phaser.Geom.Point(800,20)],true);
     g.fillPoints([new Phaser.Geom.Point(85,425),new Phaser.Geom.Point(800,55),new Phaser.Geom.Point(800,20),new Phaser.Geom.Point(85,390)],true);
     g.lineStyle(5,0x9bc5c1,0.75);g.lineBetween(800,65,800,800);g.lineBetween(220,520,1390,520);
     g.lineStyle(2,0xd4e8db,0.55);g.lineBetween(800,65,1510,425);g.lineBetween(800,65,90,425);
     [[500,365],[675,455],[1000,365],[1190,465],[430,650],[1130,680]].forEach(([x,y])=>this.add.image(x,y,"desk").setScale(0.22).setDepth(y-20));
     this.add.image(260,285,"whiteboard").setScale(0.22).setDepth(270);
     this.add.image(1300,290,"tasks").setScale(0.18).setDepth(275);
     this.add.image(1320,690,"coffee").setScale(0.24).setDepth(680);
     this.add.image(250,675,"plant").setScale(0.23).setDepth(680);
     this.add.image(1450,610,"plant").setScale(0.20).setDepth(610);
     this.add.image(790,270,"plant").setScale(0.19).setDepth(270);
     AGENTS.forEach((agent)=>{
      const group=this.add.container(agent.x,agent.y).setDepth(agent.y+20);
      const sprite=this.add.image(0,0,agent.texture).setScale(0.19).setOrigin(0.5,0.82);
      const shadow=this.add.ellipse(0,5,58,18,0x0b1515,0.35);
      const name=this.add.text(0,-116,agent.name,{fontFamily:"Arial",fontSize:"18px",color:"#fff7dd",fontStyle:"bold",backgroundColor:"#243b3c",padding:{x:9,y:5}}).setOrigin(0.5);
      const status=this.add.text(0,-88,agent.status,{fontFamily:"Arial",fontSize:"12px",color:"#e8f4e8",backgroundColor:"#527e69",padding:{x:7,y:4}}).setOrigin(0.5);
      group.add([shadow,sprite,name,status]);group.setSize(90,150);
      group.setInteractive(new Phaser.Geom.Rectangle(-48,-140,96,150),Phaser.Geom.Rectangle.Contains);
      group.on("pointerdown",()=>{this.add.text(agent.x+55,agent.y-30,agent.role,{fontFamily:"Arial",fontSize:"14px",color:"#fff",backgroundColor:"#182f36",padding:{x:8,y:8}}).setDepth(900);});
      this.tweens.add({targets:sprite,y:-4,duration:1250,yoyo:true,repeat:-1,ease:"Sine.easeInOut"});
     });
     this.add.text(800,115,"MEX-NEX · HEADQUARTERS",{fontFamily:"Arial",fontSize:"24px",color:"#f7e9c8",fontStyle:"bold",letterSpacing:4}).setOrigin(0.5);
     const camera=this.cameras.main;camera.setBounds(0,0,1600,1000);
     const fit=()=>camera.setZoom(Math.min(this.scale.width/1600,this.scale.height/1000)*1.12);fit();this.scale.on("resize",fit);
     this.input.on("pointerdown",(p:import("phaser").Input.Pointer)=>{this.dragPoint={x:p.x,y:p.y};});
     this.input.on("pointerup",()=>{this.dragPoint=undefined;});
     this.input.on("pointermove",(p:import("phaser").Input.Pointer)=>{if(this.dragPoint&&p.isDown){camera.scrollX-=(p.x-this.dragPoint.x)/camera.zoom;camera.scrollY-=(p.y-this.dragPoint.y)/camera.zoom;this.dragPoint={x:p.x,y:p.y};}});
     this.input.on("wheel",(_p:unknown,_o:unknown,_dx:number,dy:number)=>camera.setZoom(Phaser.Math.Clamp(camera.zoom-dy*0.001,0.45,1.45)));
    }
    private zone(g:import("phaser").GameObjects.Graphics,x:number,y:number,w:number,h:number,color:number,label:string){
     g.fillStyle(color,0.18).fillRoundedRect(x-w/2,y-h/2,w,h,24);g.lineStyle(3,color,0.75).strokeRoundedRect(x-w/2,y-h/2,w,h,24);
     this.add.text(x,y-h/2+16,label,{fontFamily:"Arial",fontSize:"15px",color:"#f5ead2",fontStyle:"bold",letterSpacing:2}).setOrigin(0.5);
    }
   }
   game=new Phaser.Game({type:Phaser.AUTO,parent:host.current,backgroundColor:"#17252a",scale:{mode:Phaser.Scale.RESIZE,width:"100%",height:"100%"},render:{antialias:false,pixelArt:true,roundPixels:true},scene:[PixelOfficeScene],banner:false});
  });
  return()=>{disposed=true;game?.destroy(true);};
 },[]);
 return <div ref={host} className="h-full min-h-[520px] w-full overflow-hidden rounded-2xl" aria-label="Pratinjau kantor MEX-NEX pixel art isometrik"/>;
}

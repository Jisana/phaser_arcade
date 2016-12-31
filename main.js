// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 
		 // Load the bird sprite
		game.load.image('bird', 'assets/bird.png'); 
		game.load.image('pipe', 'assets/pipe.png');
    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.  
	  // Change the background color of the game to blue
		game.stage.backgroundColor = '#71c5cf';
		 game.forceSingleUpdate = true;
  //  This sets a limit on the up-scale
    /*game.scale.maxWidth = 1920;
    game.scale.maxHeight = 1200;
*/
    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
   // game.world.setBounds(0, 0, 1920, 1200);

		// Set the physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// Display the bird at the position x=100 and y=245
		this.bird = game.add.sprite(100, 245, 'bird');
		this.bird.zIndex = 1;
		this.b2 = game.add.sprite(160, 350, 'bird');
		this.b2.zIndex = 1;
		// Add physics to the bird
		// Needed for: movements, gravity, collisions, etc.
		 
		game.physics.arcade.enable(this.bird);
		game.physics.arcade.enable(this.b2);

		// Add gravity to the bird to make it fall
		this.bird.body.gravity.y = 1000;  
		
		
		// Call the 'jump' function when the spacekey is hit
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.arrowLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.arrowRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		
		// Create an empty group
		this.pipes = game.add.group(); 
		this.addRowOfPipes();
		this.back_gamers = game.add.group();
		this.gamers = game.add.group(); 
		this.gamers.add(this.b2);
		//this.timer = game.time.events.loop(1500, , this); 
		 game.camera.follow(this.bird);
		 
		this.world_scale_x=1;
		 this.scale_x=0.005;
		 this.world_scale_zoom = this.scale_x;
		 this.one_world_scale_zoom = 1;
		this.old_w = 400;
		this.old_h= 490;
		this.old_height= this.old_h;
		this.old_width= this.old_w;
		this.new_heigth = game.height;
		this.new_width = game.width;
		this.rest_heigth = 0;
		this.rest_width = 0;
    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   
		
		
		//if (this.bird.y < 0 || this.bird.y > 490*(1+this.world_scale_zoom)) this.restartGame();
		//game.physics.arcade.overlap(this.bird, this.pipes,this.fixBird, null, this);
		game.physics.arcade.overlap(this.bird, this.pipes,this.fixBird, null, this);
		game.physics.arcade.overlap(this.bird, this.gamers,this.checkGamersEat, null, this);
		this.spaceKey.onDown.add(this.jump, this);     
		if(this.arrowLeftKey.isDown) this.moveX("L");   
		if(this.arrowRightKey.isDown) this.moveX("R"); 
		

		
		
    },
	
	setToScale:function(o,zX,zY){
		var old_height = o.height;
		var new_heigth = old_height*zY;
		var rest_heigth = new_heigth - old_height;
		/*console.log("##");
		console.log(old_height);
		console.log(new_heigth);
		console.log(rest_heigth);
		console.log("--");*/
		o.scale.setTo(zX,zY); 
		o.y -= rest_heigth; 
		//o.x-= o.x*this.world_scale_zoom;
	},
	
	backToScale:function(o,zX,zY){
		var actual_scale = o.scale.y;
		var new_scale = 1;
		var rest_scale = o.scale.y - new_scale;
		var old_height = "";
		var new_heigth = "";
		var rest_heigth = "";
		//console.log("B: "+rest_scale);
			//si la resta es positiva significa que estamos trabajando con objetos con scale >1
			if(rest_scale > 0){
					o.scale.setTo(1,1);
					new_heigth = o.height*rest_scale;
					o.y += new_heigth;
					o.alpha=1;
					var hole = Math.floor(Math.random() * 450) + 1;
					o.x = hole;
					o.body.velocity.x = 0;
			}
		
	},
	
	updateVision:function(){
				//console.log(this.bird.z);
				//TODO: ordenar por orden la visualacion, los que rest > 0  deben ir al fondo. 
			
			this.bird.moveUp();
			this.gamers.forEach(function(gamer){
				var rest = gamer.zIndex-this.bird.zIndex;
					//console.log(rest);
					//Ejemplo:  
					// this.bird.zIndex = 10;
					// this.gamer.zIndex = 11;
					// rest =1;
					
					if(rest < 0 || rest > 3 ){ gamer.destroy();}
					if(rest == 2){ gamer.alpha = 0.2;this.setToScale(gamer, 1.5,1.5);gamer.body.velocity.x = -50; this.back_gamers.add(gamer);}
					if(rest ==1){ gamer.alpha = 0.4;this.setToScale(gamer, 1.2,1.2);gamer.body.velocity.x = 50;  this.back_gamers.add(gamer);}
					if( rest ==0 ) { console.log(gamer.x);}
					//if(rest < 0){	gamer.destroy();}
					
			},this);

	},
	
	
	
	checkGamersEat:function(){
		var collision = false;
		//comprobamos con quien hemos chocado y lo borramos e insertamos 3 nuevos gamers
		this.gamers.forEach(function(gamer){
			if(game.physics.arcade.overlap(this.bird, gamer)){ 
				//	console.log(this.bird.zIndex);
				//	console.log(gamer.zIndex);
					if(this.bird.zIndex==gamer.zIndex) {
							collision = true;
							gamer.destroy(); 
							this.getBigger(); 
							this.addOneGamer(this.bird.zIndex+2);
							this.addOneGamer(this.bird.zIndex+1);
							this.addOneGamer(this.bird.zIndex);
							//this.addOneGamer(this.bird.zIndex+1);

						
				}
			}
		},this);
		
		if(collision){
				//mandamos a todos los pajaros que no necesitamos al layer back_gamers
				this.updateVision();
				
				//comprobamos que hayan pajaros en back_gamers que los pueda reusar
				console.log("##########");
				this.back_gamers.forEach(function(gamer){
							var rest = gamer.zIndex-this.bird.zIndex;
							console.log(rest);
							if(rest ==2 ){ gamer.alpha = 0.2;
												  this.setToScale(gamer, 1.5,1.5);
												  gamer.body.velocity.x = 50; }
							if(rest ==1 ){ gamer.alpha = 0.4;
												this.setToScale(gamer, 1.2,1.2);
												  gamer.body.velocity.x = -50; }
							if(rest ==0 ) {this.backToScale(gamer,1,1);
												  this.gamers.add(gamer); 
								}
							
							//if(rest < -1 ){	gamer.destroy();}
				},this);
		}
		
	},

	getBigger:function(){
		if(this.bird.zIndex > 100) exit();
		this.bird.zIndex +=1;
	    
		
		
	},
	
	moveX:function(direction){
		move_x = 4;
		if(direction == "L") this.bird.x-=move_x;
		if(direction == "R") this.bird.x+=move_x;
	},
	
	fixBird:function(){
	  this.pipes.forEach(function(p){
			if(game.physics.arcade.overlap(this.bird, p)){ 
				this.bird.body.y = p.y-p.height;
				this.bird.body.velocity.y = 1;
			}
	},this);
		
	
	 //this.gamers.forEach (function(g){ if(g!=null){ this.g.body.y = 350;} }) 
	},
	
	// Make the bird jump 
	jump: function() {
		// Add a vertical velocity to the bird
		//console.log(this.bird.zIndex);
		this.bird.body.velocity.y = -350;
	},

	// Restart the game
	restartGame: function() {
		// Start the 'main' state, which restarts the game
		game.state.start('main');
	
		
	},
	addOneGamer:function( zInd = 1){
		var hole = Math.floor(Math.random() * 450) + 1;
		this.g = game.add.sprite(50+hole, 350, 'bird');
		
			//console.log("Entrada Index:" + zInd);
			// Add the pipe to our previously created group
		

			// Enable physics on the pipe 
			game.physics.arcade.enable(this.g);
			this.g.zIndex = zInd;
			
			this.gamers.add(this.g);
	},
	
	addOnePipe: function(x, y) {
			// Create a pipe at the position x and y
			var pipe = game.add.sprite(x, y, 'pipe');
		//pipe.scale.x=12;
			// Add the pipe to our previously created group
			this.pipes.add(pipe);
			
			// Enable physics on the pipe 
			game.physics.arcade.enable(pipe);

			// Add velocity to the pipe to make it move left
			//pipe.body.velocity.x = -200; 

			// Automatically kill the pipe when it's no longer visible 
			//pipe.checkWorldBounds = true;
			//pipe.outOfBoundsKill = true;
		},
			
		addRowOfPipes: function() {
			// Randomly pick a number between 1 and 5
			// This will be the hole position
			var hole = Math.floor(Math.random() * 5) + 1;

			// Add the 6 pipes 
			// With one big hole at position 'hole' and 'hole + 1'
			for (var i = 0; i < 8; i++)
			
					this.addOnePipe(i * 60 + 10,400);   
		},
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(600, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 

// Start the state to actually start the game
game.state.start('main');


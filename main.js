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
		
		
		/*if(game.input.keyboard.isDown(Phaser.Keyboard.Q)){
				this.old_height= this.old_h;
				this.old_width= this.old_w;
				console.log("OLD");
				console.log(this.old_height);
				console.log(this.old_width);
				
				this.world_scale_x = this.world_scale_x-this.scale_x;
				this.world_scale_zoom += this.scale_x;
				this.one_world_scale_zoom += this.scale_x;
				//game.world.scale.setTo(this.world_scale_x);
				console.log(this.world_scale_x);
				console.log(this.world_scale_zoom);
				console.log(this.one_world_scale_zoom);
				
				this.new_heigth = game.height*this.world_scale_x;
				this.new_width = game.width*this.world_scale_x;
				
				console.log("NEW");
				console.log(this.new_heigth);
				console.log(this.new_width);
				
				
				this.rest_heigth = this.old_height-this.new_heigth;
				this.rest_width = this.old_width-this.new_width;
				
				console.log("REST");
				console.log(this.rest_heigth);
				console.log(this.rest_width);
			
				/*this.pipes.scale.setTo(this.world_scale_x,this.world_scale_x);
				this.gamers.scale.setTo(this.world_scale_x,this.world_scale_x);
				this.bird.scale.setTo(this.world_scale_x,this.world_scale_x);
			
				this.pipes.forEach(function(pi){
				
							this.setToScale(pi);
				
				//	pi.y += this.old_height*this.world_scale_zoom;
					console.log(pi.y);
				//	pi.x += this.rest_width;
				},this);
				this.gamers.forEach(function(g){
					this.setToScale(g);
					console.log(g.y);
				},this);
				this.bird.y +=this.old_height*this.world_scale_zoom;
			
			
			
		}*/
		
		
    },
	
	setToScale:function(o){
		o.height=o.height*this.world_scale_x;
		o.width=o.width*this.world_scale_x;
		o.x-= o.x*this.world_scale_zoom;
	},
	
	updateVision:function(){
				//console.log(this.bird.z);
				//TODO: ordenar por orden la visualacion, los que rest > 0  deben ir al fondo. 
			this.one_world_scale_zoom += this.scale_x;
			this.bird.moveUp();
			this.gamers.forEach(function(gamer){
				var rest = gamer.zIndex-this.bird.zIndex;
				//console.log(rest);
					if(rest >3 ){ gamer.destroy();  }
					if(rest ==2 ){ console.log("a2"); gamer.body.alpha = 0.2;gamer.scale.setTo(1.5,1.5);gamer.body.velocity.x = -200; this.back_gamers.add(gamer);}
					if( rest ==1 ){ console.log("a1");gamer.body.alpha = 0.4;gamer.scale.setTo(1.2,1.2);gamer.body.velocity.x = 200; this.back_gamers.add(gamer);}
					if( rest ==0 ) {console.log(gamer); }
					if(rest < 0){
						gamer.destroy();}
					
			},this);
		this.back_gamers.forEach(function(gamer){
					var rest = gamer.zIndex-this.bird.zIndex;
					
					if(rest ==2 ){ console.log("a2"); gamer.alpha = 0.2;gamer.scale.setTo(1.5,1.5);this.back_gamers.add(gamer);gamer.body.velocity.x = -200; }
					if( rest ==1 ){ console.log("a1");gamer.alpha = 0.4;gamer.scale.setTo(1.2,1.2);this.back_gamers.add(gamer);gamer.body.velocity.x = 200; }
					if( rest ==0 ) {gamer.scale.setTo(1,1);gamer.body.velocity.x = 0; gamer.alpha = 1;this.gamers.add(gamer); }
					if(rest < 0 || rest > 3){	gamer.destroy();}
					
					
		},this);
	},
	
	checkGamersEat:function(){
		this.gamers.forEach(function(gamer){
			if(game.physics.arcade.overlap(this.bird, gamer)){ 
					console.log(this.bird.zIndex);
					console.log(gamer.zIndex);
					if(this.bird.zIndex==gamer.zIndex) {
							gamer.destroy(); 
							this.getBigger(); 
							this.addOneGamer(this.bird.zIndex+2);
							this.addOneGamer(this.bird.zIndex+1);
							this.addOneGamer(this.bird.zIndex);
							//this.addOneGamer(this.bird.zIndex+1);
							this.updateVision();
					}
			}
		},this);
	},

	getBigger:function(){
		console.log(this.bird.scale.x);
		//this.bird.scale.setTo(this.one_world_scale_zoom, this.one_world_scale_zoom);
		this.bird.zIndex +=1;
	    //console.log(this.bird.z);
		if(this.bird.zIndex > 100) exit();
			//game.add.tween(sprite.scale).to( { x: 3, y: 3 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
		if( (this.game.height - this.bird.body.height) < 250) {
			//redimensionar todo
			
		}
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
		var hole = Math.floor(Math.random() * 200) + 1;
		this.g = game.add.sprite(50+hole, 350, 'bird');
		this.setToScale(this.g);
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


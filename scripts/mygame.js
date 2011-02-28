/*
** JavaScript by Scott Greenfield - @myusernamerocks
** https://github.com/sgreenfield
**
** Artwork by Nina Urban
*/
(function(){
    var width = 1000,
        height = 750,
        imgURL = 'images/',
        refreshRate = 30,
        sky = new $.gameQuery.Animation({imageURL: imgURL + "sky.jpg"}),
        trees = new $.gameQuery.Animation({imageURL: imgURL + "trees1.png"}),
        trees2 = new $.gameQuery.Animation({imageURL: imgURL + "trees2.png"}),
        path = new $.gameQuery.Animation({imageURL: imgURL + "path1.png"}),
        path2 = new $.gameQuery.Animation({imageURL: imgURL + "path2.png"}),
        bush = new $.gameQuery.Animation({imageURL: imgURL + "bushes.png"}),
        bunnyMoving = new $.gameQuery.Animation({
            imageURL: imgURL + "bunny_sprite.png",
            numberOfFrame: 5,
            delta: 76,
            rate: 30,
            type: $.gameQuery.ANIMATION_HORIZONTAL
        }),
        bunnyStill = new $.gameQuery.Animation({
            imageURL: imgURL + "bunny_sprite.png"
        });        
    
    this.init = function(){
        this.$game = $('#thegame');
        this.loadGame();
        this.gameControls();
        this.addGroups();
        this.startScreen();
        this.registerCallbacks();        
    };
    
    this.loadGame = function(){
        this.$game.playground({
            height: height,
            width: width,
            keyTracker: true
        });
    };
    
    this.gameControls = function(){
        var self = this;
        
        this.movement = {};
        this.movement.go = false;
        
        $(document).keydown(function(e){
            var k = e.keyCode;

            if (self.movement.go === true) return false; //prevents recurrence if key is helled down
            if (k === 40 || k === 39 || k === 38 || k === 37 || k === 32){
                self.movement.go = true; //pressed a movement key
            }else{
                
            }
            
            if (k === 40){ //down
                self.movement.direction = 'down';
            }            
            if (k === 39){ //right
                self.movement.direction = 'right';
                
                $('#bunny').show();
                $('#bunnyStill').hide();
            }
            if (k === 38){ //up
                self.movement.direction = 'up';
            }
            if(k === 37){ //left
                self.movement.direction = 'left';
            }
            if(k === 32){ //jump
                self.movement.direction = 'action';
            }

            return false; //prevent scrolling up and down
        });
        
        $(document).keyup(function(e){
            var k = e.keyCode;
            
            if (k === 40 || k === 39 || k === 38 || k === 37 || k === 32){ //if movement key(s) released
                $('#bunny').hide();
                $('#bunnyStill').show();
                self.movement.go = false;
            }
        });
    };
    
    this.addGroups = function(){
        $.playground()
            .addGroup("background")
                .addSprite("sky", {animation: sky, width: width, height: height})
                .addSprite("trees", {animation: trees, width: 1000, height: 750})
                .addSprite("trees2", {animation: trees2, width: 1000, height: 750, posx: 1000})
                .addSprite("path", {animation: path, width: 1000, height: 174, posy: 576})
                .addSprite("path2", {animation: path2, width: 1000, height: 174, posx: 1000, posy: 576})
            .end()
            .addGroup("character", {width: 38, height: 35})
                .addSprite("bunny", {animation: bunnyMoving, width: 76, height: 70, posx: 481, posy: 646}) //posx = (playgroundwidth / 2) - (characterwidth / 2)
                .addSprite("bunnyStill", {animation: bunnyStill, width: 76, height: 70, posx: 481, posy: 646}) //posx = (playgroundwidth / 2) - (characterwidth / 2)
            .addGroup("bushes", {width: 1000, height: 114})
                .addSprite("bush", {animation: bush, width: 1000, height: 63, posy: 687})
                .addSprite("bush2", {animation: bush, width: 1000, height: 63, posx: 1000, posy: 697});
    }
    
    this.startScreen = function(){
        $().setLoadBar("loadingBar", 400);
    
        $("#startbutton").click(function(){
            $.playground().startGame(function(){
                $('#bunny').hide();
                $("#welcomeScreen").remove();
            });
        });
    };
    
    this.registerCallbacks = function(){
        var self = this,
            pathSpeed = 14;
            bushSpeed = 18;

        $.playground().registerCallback(function(){
            if (self.movement.go){
                //if (self.movement.direction === 'left'){ //must change offset of 2nd tile to -1000
                //    console.log('go left');
                //}
                if (self.movement.direction === 'right' || self.movement.direction === 'left'){
                    self.doAnim("#path", pathSpeed);
                    self.doAnim("#path2", pathSpeed);

                    self.doAnim("#bush", bushSpeed);
                    self.doAnim("#bush2", bushSpeed);

                    self.doAnim("#trees", pathSpeed);
                    self.doAnim("#trees2", pathSpeed);   
                }
            }
            
        }, refreshRate);
    };
    
    this.doAnim = function(id, speed){
        var nextTile = 2 * -width,
            right, left;
            
        if (this.movement.direction === 'left') speed = -speed; //this makes it scroll left

        right = (parseInt($(id).css("left")) - speed - width) % nextTile;
        left = right + width;
        
        //console.log(id, 'left: ', left);
        //if (this.movement.direction === 'left') left = -left; //must change offset here or somewhere else...

        $(id).css("left", left);
    };
}).apply(mygame = {});
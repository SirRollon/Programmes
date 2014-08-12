
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}

	BBMonkeyGame.Main( document.getElementById( "GameCanvas" ) );
}

//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat";
CFG_BRL_GAMETARGET_IMPLEMENTED="1";
CFG_BRL_THREAD_IMPLEMENTED="1";
CFG_CONFIG="debug";
CFG_HOST="winnt";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MOJO_AUTO_SUSPEND_ENABLED="1";
CFG_MOJO_DRIVER_IMPLEMENTED="1";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json|*.fnt";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n[angel3.png];type=image/png;width=256;height=256;\n[angel_verdana.png];type=image/png;width=256;height=256;\n[angel_verdana_0.png];type=image/png;width=256;height=256;\n[pagedfont_0.png];type=image/png;width=128;height=128;\n[pagedfont_1.png];type=image/png;width=128;height=128;\n";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	if( window.console!=undefined ) window.console.log( str );
}

function debugStop(){
	debugger;	//	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_charCodeAt( str,index ){
	if( index<0 || index>=str.length ) error( "Character index out of range" );
	return str.charCodeAt( index );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}


function BBGameEvent(){}
BBGameEvent.KeyDown=1;
BBGameEvent.KeyUp=2;
BBGameEvent.KeyChar=3;
BBGameEvent.MouseDown=4;
BBGameEvent.MouseUp=5;
BBGameEvent.MouseMove=6;
BBGameEvent.TouchDown=7;
BBGameEvent.TouchUp=8;
BBGameEvent.TouchMove=9;
BBGameEvent.MotionAccel=10;

function BBGameDelegate(){}
BBGameDelegate.prototype.StartGame=function(){}
BBGameDelegate.prototype.SuspendGame=function(){}
BBGameDelegate.prototype.ResumeGame=function(){}
BBGameDelegate.prototype.UpdateGame=function(){}
BBGameDelegate.prototype.RenderGame=function(){}
BBGameDelegate.prototype.KeyEvent=function( ev,data ){}
BBGameDelegate.prototype.MouseEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.TouchEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.MotionEvent=function( ev,data,x,y,z ){}
BBGameDelegate.prototype.DiscardGraphics=function(){}

function BBGame(){
	BBGame._game=this;
	this._delegate=null;
	this._keyboardEnabled=false;
	this._updateRate=0;
	this._started=false;
	this._suspended=false;
	this._debugExs=(CFG_CONFIG=="debug");
	this._startms=Date.now();
}

BBGame.Game=function(){
	return BBGame._game;
}

BBGame.prototype.SetDelegate=function( delegate ){
	this._delegate=delegate;
}

BBGame.prototype.Delegate=function(){
	return this._delegate;
}

BBGame.prototype.SetUpdateRate=function( updateRate ){
	this._updateRate=updateRate;
}

BBGame.prototype.SetKeyboardEnabled=function( keyboardEnabled ){
	this._keyboardEnabled=keyboardEnabled;
}

BBGame.prototype.Started=function(){
	return this._started;
}

BBGame.prototype.Suspended=function(){
	return this._suspended;
}

BBGame.prototype.Millisecs=function(){
	return Date.now()-this._startms;
}

BBGame.prototype.GetDate=function( date ){
	var n=date.length;
	if( n>0 ){
		var t=new Date();
		date[0]=t.getFullYear();
		if( n>1 ){
			date[1]=t.getMonth()+1;
			if( n>2 ){
				date[2]=t.getDate();
				if( n>3 ){
					date[3]=t.getHours();
					if( n>4 ){
						date[4]=t.getMinutes();
						if( n>5 ){
							date[5]=t.getSeconds();
							if( n>6 ){
								date[6]=t.getMilliseconds();
							}
						}
					}
				}
			}
		}
	}
}

BBGame.prototype.SaveState=function( state ){
	localStorage.setItem( "monkeystate@"+document.URL,state );	//key can't start with dot in Chrome!
	return 1;
}

BBGame.prototype.LoadState=function(){
	var state=localStorage.getItem( "monkeystate@"+document.URL );
	if( state ) return state;
	return "";
}

BBGame.prototype.LoadString=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );
	
	xhr.send( null );
	
	if( xhr.status==200 || xhr.status==0 ) return xhr.responseText;
	
	return "";
}

BBGame.prototype.PollJoystick=function( port,joyx,joyy,joyz,buttons ){
	return false;
}

BBGame.prototype.OpenUrl=function( url ){
	window.location=url;
}

BBGame.prototype.SetMouseVisible=function( visible ){
	if( visible ){
		this._canvas.style.cursor='default';	
	}else{
		this._canvas.style.cursor="url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
	}
}

BBGame.prototype.PathToFilePath=function( path ){
	return "";
}

//***** js Game *****

BBGame.prototype.PathToUrl=function( path ){
	return path;
}

BBGame.prototype.LoadData=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );

	if( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );

	xhr.send( null );
	if( xhr.status!=200 && xhr.status!=0 ) return null;

	var r=xhr.responseText;
	var buf=new ArrayBuffer( r.length );
	var bytes=new Int8Array( buf );
	for( var i=0;i<r.length;++i ){
		bytes[i]=r.charCodeAt( i );
	}
	return buf;
}

//***** INTERNAL ******

BBGame.prototype.Die=function( ex ){

	this._delegate=new BBGameDelegate();
	
	if( !ex.toString() ){
		return;
	}
	
	if( this._debugExs ){
		print( "Monkey Runtime Error : "+ex.toString() );
		print( stackTrace() );
	}
	
	throw ex;
}

BBGame.prototype.StartGame=function(){

	if( this._started ) return;
	this._started=true;
	
	if( this._debugExs ){
		try{
			this._delegate.StartGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.StartGame();
	}
}

BBGame.prototype.SuspendGame=function(){

	if( !this._started || this._suspended ) return;
	this._suspended=true;
	
	if( this._debugExs ){
		try{
			this._delegate.SuspendGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.SuspendGame();
	}
}

BBGame.prototype.ResumeGame=function(){

	if( !this._started || !this._suspended ) return;
	this._suspended=false;
	
	if( this._debugExs ){
		try{
			this._delegate.ResumeGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.ResumeGame();
	}
}

BBGame.prototype.UpdateGame=function(){

	if( !this._started || this._suspended ) return;

	if( this._debugExs ){
		try{
			this._delegate.UpdateGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.UpdateGame();
	}
}

BBGame.prototype.RenderGame=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.RenderGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.RenderGame();
	}
}

BBGame.prototype.KeyEvent=function( ev,data ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.KeyEvent( ev,data );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.KeyEvent( ev,data );
	}
}

BBGame.prototype.MouseEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MouseEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MouseEvent( ev,data,x,y );
	}
}

BBGame.prototype.TouchEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.TouchEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.TouchEvent( ev,data,x,y );
	}
}

BBGame.prototype.MotionEvent=function( ev,data,x,y,z ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MotionEvent( ev,data,x,y,z );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MotionEvent( ev,data,x,y,z );
	}
}

BBGame.prototype.DiscardGraphics=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.DiscardGraphics();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.DiscardGraphics();
	}
}


function BBHtml5Game( canvas ){
	BBGame.call( this );
	BBHtml5Game._game=this;
	this._canvas=canvas;
	this._loading=0;
	this._timerSeq=0;
	this._gl=null;
	if( CFG_OPENGL_GLES20_ENABLED=="1" ){
		this._gl=this._canvas.getContext( "webgl" );
		if( !this._gl ) this._gl=this._canvas.getContext( "experimental-webgl" );
		if( !this._gl ) this.Die( "Can't create WebGL" );
		gl=this._gl;
	}
}

BBHtml5Game.prototype=extend_class( BBGame );

BBHtml5Game.Html5Game=function(){
	return BBHtml5Game._game;
}

BBHtml5Game.prototype.ValidateUpdateTimer=function(){

	++this._timerSeq;

	if( !this._updateRate || this._suspended ) return;
	
	var game=this;
	var updatePeriod=1000.0/this._updateRate;
	var nextUpdate=Date.now()+updatePeriod;
	var seq=game._timerSeq;
	
	function timeElapsed(){
		if( seq!=game._timerSeq ) return;

		var time;		
		var updates;
		
		for( updates=0;updates<4;++updates ){
		
			nextUpdate+=updatePeriod;
			
			game.UpdateGame();
			if( seq!=game._timerSeq ) return;
			
			if( nextUpdate-Date.now()>0 ) break;
		}
		
		game.RenderGame();
		if( seq!=game._timerSeq ) return;
		
		if( updates==4 ){
			nextUpdate=Date.now();
			setTimeout( timeElapsed,0 );
		}else{
			var delay=nextUpdate-Date.now();
			setTimeout( timeElapsed,delay>0 ? delay : 0 );
		}
	}

	setTimeout( timeElapsed,updatePeriod );
}

//***** BBGame methods *****

BBHtml5Game.prototype.SetUpdateRate=function( updateRate ){

	BBGame.prototype.SetUpdateRate.call( this,updateRate );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.GetMetaData=function( path,key ){
	if( path.indexOf( "monkey://data/" )!=0 ) return "";
	path=path.slice(14);

	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

BBHtml5Game.prototype.PathToUrl=function( path ){
	if( path.indexOf( "monkey:" )!=0 ){
		return path;
	}else if( path.indexOf( "monkey://data/" )==0 ) {
		return "data/"+path.slice( 14 );
	}
	return "";
}

BBHtml5Game.prototype.GetLoading=function(){
	return this._loading;
}

BBHtml5Game.prototype.IncLoading=function(){
	++this._loading;
	return this._loading;
}

BBHtml5Game.prototype.DecLoading=function(){
	--this._loading;
	return this._loading;
}

BBHtml5Game.prototype.GetCanvas=function(){
	return this._canvas;
}

BBHtml5Game.prototype.GetWebGL=function(){
	return this._gl;
}

//***** INTERNAL *****

BBHtml5Game.prototype.UpdateGame=function(){

	if( !this._loading ) BBGame.prototype.UpdateGame.call( this );
}

BBHtml5Game.prototype.SuspendGame=function(){

	BBGame.prototype.SuspendGame.call( this );
	
	BBGame.prototype.RenderGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.ResumeGame=function(){

	BBGame.prototype.ResumeGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.Run=function(){

	var game=this;
	var canvas=game._canvas;
	
	var touchIds=new Array( 32 );
	for( i=0;i<32;++i ) touchIds[i]=-1;
	
	function eatEvent( e ){
		if( e.stopPropagation ){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble=true;
			e.returnValue=false;
		}
	}
	
	function keyToChar( key ){
		switch( key ){
		case 8:case 9:case 13:case 27:case 32:return key;
		case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 45:return key|0x10000;
		case 46:return 127;
		}
		return 0;
	}
	
	function mouseX( e ){
		var x=e.clientX+document.body.scrollLeft;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}
	
	function mouseY( e ){
		var y=e.clientY+document.body.scrollTop;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}

	function touchX( touch ){
		var x=touch.pageX;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x;
	}			
	
	function touchY( touch ){
		var y=touch.pageY;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y;
	}
	
	canvas.onkeydown=function( e ){
		game.KeyEvent( BBGameEvent.KeyDown,e.keyCode );
		var chr=keyToChar( e.keyCode );
		if( chr ) game.KeyEvent( BBGameEvent.KeyChar,chr );
		if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
	}

	canvas.onkeyup=function( e ){
		game.KeyEvent( BBGameEvent.KeyUp,e.keyCode );
	}

	canvas.onkeypress=function( e ){
		if( e.charCode ){
			game.KeyEvent( BBGameEvent.KeyChar,e.charCode );
		}else if( e.which ){
			game.KeyEvent( BBGameEvent.KeyChar,e.which );
		}
	}

	canvas.onmousedown=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseDown,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseDown,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseDown,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmouseup=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmousemove=function( e ){
		game.MouseEvent( BBGameEvent.MouseMove,-1,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.onmouseout=function( e ){
		game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );
		eatEvent( e );
	}
	
	canvas.onclick=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		eatEvent( e );
		return;
	}
	
	canvas.oncontextmenu=function( e ){
		return false;
	}
	
	canvas.ontouchstart=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=-1 ) continue;
				touchIds[j]=touch.identifier;
				game.TouchEvent( BBGameEvent.TouchDown,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchmove=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				game.TouchEvent( BBGameEvent.TouchMove,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchend=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				touchIds[j]=-1;
				game.TouchEvent( BBGameEvent.TouchUp,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	window.ondevicemotion=function( e ){
		var tx=e.accelerationIncludingGravity.x/9.81;
		var ty=e.accelerationIncludingGravity.y/9.81;
		var tz=e.accelerationIncludingGravity.z/9.81;
		var x,y;
		switch( window.orientation ){
		case   0:x=+tx;y=-ty;break;
		case 180:x=-tx;y=+ty;break;
		case  90:x=-ty;y=-tx;break;
		case -90:x=+ty;y=+tx;break;
		}
		game.MotionEvent( BBGameEvent.MotionAccel,0,x,y,tz );
		eatEvent( e );
	}

	canvas.onfocus=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.ResumeGame();
		}
	}
	
	canvas.onblur=function( e ){
		for( var i=0;i<256;++i ) game.KeyEvent( BBGameEvent.KeyUp,i );
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.SuspendGame();
		}
	}
	
	canvas.focus();
	
	game.StartGame();

	game.RenderGame();
}


function BBMonkeyGame( canvas ){
	BBHtml5Game.call( this,canvas );
}

BBMonkeyGame.prototype=extend_class( BBHtml5Game );

BBMonkeyGame.Main=function( canvas ){

	var game=new BBMonkeyGame( canvas );

	try{

		bbInit();
		bbMain();

	}catch( ex ){
	
		game.Die( ex );
		return;
	}

	if( !game.Delegate() ) return;
	
	game.Run();
}


// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

//***** gxtkGraphics class *****

function gxtkGraphics(){
	this.game=BBHtml5Game.Html5Game();
	this.canvas=this.game.GetCanvas()
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	this.gl=null;
	this.gc=this.canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	if( !this.gc ) return 0;
	this.gc.save();
	if( this.game.GetLoading() ) return 2;
	return 1;
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var game=this.game;

	var ty=game.GetMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;
	
	function onloadfun(){
		game.DecLoading();
	}
	
	game.IncLoading();

	var image=new Image();
	image.onload=onloadfun;
	image.meta_width=parseInt( game.GetMetaData( path,"width" ) );
	image.meta_height=parseInt( game.GetMetaData( path,"height" ) );
	image.src=game.PathToUrl( path );

	return new gxtkSurface( image,this );
}

gxtkGraphics.prototype.CreateSurface=function( width,height ){
	var canvas=document.createElement( 'canvas' );
	
	canvas.width=width;
	canvas.height=height;
	canvas.meta_width=width;
	canvas.meta_height=height;
	canvas.complete=true;
	
	var surface=new gxtkSurface( canvas,this );
	
	surface.gc=canvas.getContext( '2d' );
	
	return surface;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;	
	this.gc.globalAlpha=this.alpha;	
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<2 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawPoly2=function( verts,surface,srx,srcy ){
	if( verts.length<4 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=4;i<verts.length;i+=4 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tmpGC=this.tmpCanvas.getContext( "2d" );
	tmpGC.globalCompositeOperation="copy";
	
	tmpGC.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tmpGC.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tmpGC.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

gxtkGraphics.prototype.ReadPixels=function( pixels,x,y,width,height,offset,pitch ){

	var imgData=this.gc.getImageData( x,y,width,height );
	
	var p=imgData.data,i=0,j=offset,px,py;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			pixels[j++]=(p[i+3]<<24)|(p[i]<<16)|(p[i+1]<<8)|p[i+2];
			i+=4;
		}
		j+=pitch-width;
	}
}

gxtkGraphics.prototype.WritePixels2=function( surface,pixels,x,y,width,height,offset,pitch ){

	if( !surface.gc ){
		if( !surface.image.complete ) return;
		var canvas=document.createElement( "canvas" );
		canvas.width=surface.swidth;
		canvas.height=surface.sheight;
		surface.gc=canvas.getContext( "2d" );
		surface.gc.globalCompositeOperation="copy";
		surface.gc.drawImage( surface.image,0,0 );
		surface.image=canvas;
	}

	var imgData=surface.gc.createImageData( width,height );

	var p=imgData.data,i=0,j=offset,px,py,argb;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			argb=pixels[j++];
			p[i]=(argb>>16) & 0xff;
			p[i+1]=(argb>>8) & 0xff;
			p[i+2]=argb & 0xff;
			p[i+3]=(argb>>24) & 0xff;
			i+=4;
		}
		j+=pitch-width;
	}
	
	surface.gc.putImageData( imgData,x,y );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

gxtkSurface.prototype.OnUnsafeLoadComplete=function(){
	return true;
}

//***** gxtkChannel class *****
function gxtkChannel(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

//***** gxtkAudio class *****
function gxtkAudio(){
	this.game=BBHtml5Game.Html5Game();
	this.okay=typeof(Audio)!="undefined";
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
		if( !this.okay ) this.channels[i].state=-1;
	}
}

gxtkAudio.prototype.Suspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ){
			if( chan.audio.ended && !chan.audio.loop ){
				chan.state=0;
			}else{
				chan.audio.pause();
				chan.state=3;
			}
		}
	}
}

gxtkAudio.prototype.Resume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==3 ){
			chan.audio.play();
			chan.state=1;
		}
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	if( !this.okay ) return null;

	var audio=new Audio( this.game.PathToUrl( path ) );
	if( !audio ) return null;
	
	return new gxtkSample( audio );
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];

	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;

	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	if( chan.state==3 ) return 1;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state>0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}

gxtkSample.prototype.Discard=function(){
}


function BBThread(){
	this.result=null;
	this.running=false;
}

BBThread.prototype.Start=function(){
	this.result=null;
	this.running=true;
	this.Run__UNSAFE__();
}

BBThread.prototype.IsRunning=function(){
	return this.running;
}

BBThread.prototype.Result=function(){
	return this.result;
}

BBThread.prototype.Run__UNSAFE__=function(){
	this.running=false;
}


function BBAsyncImageLoaderThread(){
	this._running=false;
}

BBAsyncImageLoaderThread.prototype.Start=function(){

	var thread=this;
	var image=new Image();

	image.onload=function( e ){
		image.meta_width=image.width;
		image.meta_height=image.height;
		thread._surface=new gxtkSurface( image,thread._device )
		thread._running=false;
	}
	
	image.onerror=function( e ){
		thread._surface=null;
		thread._running=false;
	}
	
	thread._running=true;
	
	image.src=BBGame.Game().PathToUrl( thread._path );
}

BBAsyncImageLoaderThread.prototype.IsRunning=function(){
	return this._running;
}



function BBAsyncSoundLoaderThread(){
}

BBAsyncSoundLoaderThread.prototype.Start=function(){
	this._sample=this._device.LoadSample( this._path );
}

BBAsyncSoundLoaderThread.prototype.IsRunning=function(){
	return false;
}

function c_App(){
	Object.call(this);
}
c_App.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<104>";
	if((bb_app__app)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<104>";
		error("App has already been created");
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<105>";
	bb_app__app=this;
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<106>";
	bb_app__delegate=c_GameDelegate.m_new.call(new c_GameDelegate);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<107>";
	bb_app__game.SetDelegate(bb_app__delegate);
	pop_err();
	return this;
}
c_App.prototype.p_OnCreate=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnSuspend=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnResume=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnUpdate=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnLoading=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnRender=function(){
	push_err();
	pop_err();
	return 0;
}
c_App.prototype.p_OnClose=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<129>";
	bb_app_EndApp();
	pop_err();
	return 0;
}
c_App.prototype.p_OnBack=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<133>";
	this.p_OnClose();
	pop_err();
	return 0;
}
function c_MyApp(){
	c_App.call(this);
	this.m_texte1=null;
}
c_MyApp.prototype=extend_class(c_App);
c_MyApp.m_new=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<13>";
	c_App.m_new.call(this);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<13>";
	pop_err();
	return this;
}
c_MyApp.prototype.p_OnCreate=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<19>";
	this.m_texte1=c_AngelFontExample.m_new.call(new c_AngelFontExample);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<20>";
	this.m_texte1.p_OnCreate();
	pop_err();
	return 0;
}
c_MyApp.prototype.p_OnUpdate=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<26>";
	this.m_texte1.p_OnUpdate();
	pop_err();
	return 0;
}
c_MyApp.prototype.p_OnRender=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<32>";
	this.m_texte1.p_OnRender();
	pop_err();
	return 0;
}
var bb_app__app=null;
function c_GameDelegate(){
	BBGameDelegate.call(this);
	this.m__graphics=null;
	this.m__audio=null;
	this.m__input=null;
}
c_GameDelegate.prototype=extend_class(BBGameDelegate);
c_GameDelegate.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<24>";
	pop_err();
	return this;
}
c_GameDelegate.prototype.StartGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<33>";
	this.m__graphics=(new gxtkGraphics);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<34>";
	bb_graphics_SetGraphicsDevice(this.m__graphics);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<35>";
	bb_graphics_SetFont(null,32);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<37>";
	this.m__audio=(new gxtkAudio);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<38>";
	bb_audio_SetAudioDevice(this.m__audio);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<40>";
	this.m__input=c_InputDevice.m_new.call(new c_InputDevice);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<41>";
	bb_input_SetInputDevice(this.m__input);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<43>";
	bb_app__app.p_OnCreate();
	pop_err();
}
c_GameDelegate.prototype.SuspendGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<47>";
	bb_app__app.p_OnSuspend();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<48>";
	this.m__audio.Suspend();
	pop_err();
}
c_GameDelegate.prototype.ResumeGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<52>";
	this.m__audio.Resume();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<53>";
	bb_app__app.p_OnResume();
	pop_err();
}
c_GameDelegate.prototype.UpdateGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<57>";
	this.m__input.p_BeginUpdate();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<58>";
	bb_app__app.p_OnUpdate();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<59>";
	this.m__input.p_EndUpdate();
	pop_err();
}
c_GameDelegate.prototype.RenderGame=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<63>";
	var t_mode=this.m__graphics.BeginRender();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<64>";
	if((t_mode)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<64>";
		bb_graphics_BeginRender();
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<65>";
	if(t_mode==2){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<65>";
		bb_app__app.p_OnLoading();
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<65>";
		bb_app__app.p_OnRender();
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<66>";
	if((t_mode)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<66>";
		bb_graphics_EndRender();
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<67>";
	this.m__graphics.EndRender();
	pop_err();
}
c_GameDelegate.prototype.KeyEvent=function(t_event,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<71>";
	this.m__input.p_KeyEvent(t_event,t_data);
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<72>";
	if(t_event!=1){
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<73>";
	var t_1=t_data;
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<74>";
	if(t_1==432){
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<75>";
		bb_app__app.p_OnClose();
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/app.monkey<76>";
		if(t_1==416){
			err_info="C:/MonkeyX77a/modules/mojo/app.monkey<77>";
			bb_app__app.p_OnBack();
		}
	}
	pop_err();
}
c_GameDelegate.prototype.MouseEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<82>";
	this.m__input.p_MouseEvent(t_event,t_data,t_x,t_y);
	pop_err();
}
c_GameDelegate.prototype.TouchEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<86>";
	this.m__input.p_TouchEvent(t_event,t_data,t_x,t_y);
	pop_err();
}
c_GameDelegate.prototype.MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<90>";
	this.m__input.p_MotionEvent(t_event,t_data,t_x,t_y,t_z);
	pop_err();
}
c_GameDelegate.prototype.DiscardGraphics=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<94>";
	this.m__graphics.DiscardGraphics();
	pop_err();
}
var bb_app__delegate=null;
var bb_app__game=null;
var bb_angelfont_example_theApp=null;
function bbMain(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<101>";
	bb_angelfont_example_theApp=c_MyApp.m_new.call(new c_MyApp);
	pop_err();
	return 0;
}
var bb_graphics_device=null;
function bb_graphics_SetGraphicsDevice(t_dev){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<59>";
	bb_graphics_device=t_dev;
	pop_err();
	return 0;
}
function c_Image(){
	Object.call(this);
	this.m_surface=null;
	this.m_width=0;
	this.m_height=0;
	this.m_frames=[];
	this.m_flags=0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_source=null;
}
c_Image.m_DefaultFlags=0;
c_Image.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<66>";
	pop_err();
	return this;
}
c_Image.prototype.p_SetHandle=function(t_tx,t_ty){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<110>";
	dbg_object(this).m_tx=t_tx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<111>";
	dbg_object(this).m_ty=t_ty;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<112>";
	dbg_object(this).m_flags=dbg_object(this).m_flags&-2;
	pop_err();
	return 0;
}
c_Image.prototype.p_ApplyFlags=function(t_iflags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<188>";
	this.m_flags=t_iflags;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<190>";
	if((this.m_flags&2)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		var t_=this.m_frames;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		var t_2=0;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
		while(t_2<t_.length){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
			var t_f=dbg_array(t_,t_2)[dbg_index];
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<191>";
			t_2=t_2+1;
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<192>";
			dbg_object(t_f).m_x+=1;
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<194>";
		this.m_width-=2;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<197>";
	if((this.m_flags&4)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		var t_3=this.m_frames;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		var t_4=0;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
		while(t_4<t_3.length){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
			var t_f2=dbg_array(t_3,t_4)[dbg_index];
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<198>";
			t_4=t_4+1;
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<199>";
			dbg_object(t_f2).m_y+=1;
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<201>";
		this.m_height-=2;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<204>";
	if((this.m_flags&1)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<205>";
		this.p_SetHandle((this.m_width)/2.0,(this.m_height)/2.0);
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<208>";
	if(this.m_frames.length==1 && dbg_object(dbg_array(this.m_frames,0)[dbg_index]).m_x==0 && dbg_object(dbg_array(this.m_frames,0)[dbg_index]).m_y==0 && this.m_width==this.m_surface.Width() && this.m_height==this.m_surface.Height()){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<209>";
		this.m_flags|=65536;
	}
	pop_err();
	return 0;
}
c_Image.prototype.p_Init=function(t_surf,t_nframes,t_iflags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<146>";
	this.m_surface=t_surf;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<148>";
	this.m_width=((this.m_surface.Width()/t_nframes)|0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<149>";
	this.m_height=this.m_surface.Height();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<151>";
	this.m_frames=new_object_array(t_nframes);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<152>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<153>";
		dbg_array(this.m_frames,t_i)[dbg_index]=c_Frame.m_new.call(new c_Frame,t_i*this.m_width,0)
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<156>";
	this.p_ApplyFlags(t_iflags);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<157>";
	pop_err();
	return this;
}
c_Image.prototype.p_Init2=function(t_surf,t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_src,t_srcx,t_srcy,t_srcw,t_srch){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<161>";
	this.m_surface=t_surf;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<162>";
	this.m_source=t_src;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<164>";
	this.m_width=t_iwidth;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<165>";
	this.m_height=t_iheight;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<167>";
	this.m_frames=new_object_array(t_nframes);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<169>";
	var t_ix=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<169>";
	var t_iy=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<171>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<172>";
		if(t_ix+this.m_width>t_srcw){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<173>";
			t_ix=0;
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<174>";
			t_iy+=this.m_height;
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<176>";
		if(t_ix+this.m_width>t_srcw || t_iy+this.m_height>t_srch){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<177>";
			error("Image frame outside surface");
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<179>";
		dbg_array(this.m_frames,t_i)[dbg_index]=c_Frame.m_new.call(new c_Frame,t_ix+t_srcx,t_iy+t_srcy)
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<180>";
		t_ix+=this.m_width;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<183>";
	this.p_ApplyFlags(t_iflags);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<184>";
	pop_err();
	return this;
}
function c_GraphicsContext(){
	Object.call(this);
	this.m_defaultFont=null;
	this.m_font=null;
	this.m_firstChar=0;
	this.m_matrixSp=0;
	this.m_ix=1.0;
	this.m_iy=.0;
	this.m_jx=.0;
	this.m_jy=1.0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_tformed=0;
	this.m_matDirty=0;
	this.m_color_r=.0;
	this.m_color_g=.0;
	this.m_color_b=.0;
	this.m_alpha=.0;
	this.m_blend=0;
	this.m_scissor_x=.0;
	this.m_scissor_y=.0;
	this.m_scissor_width=.0;
	this.m_scissor_height=.0;
	this.m_matrixStack=new_number_array(192);
}
c_GraphicsContext.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<25>";
	pop_err();
	return this;
}
c_GraphicsContext.prototype.p_Validate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<36>";
	if((this.m_matDirty)!=0){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<37>";
		bb_graphics_renderDevice.SetMatrix(dbg_object(bb_graphics_context).m_ix,dbg_object(bb_graphics_context).m_iy,dbg_object(bb_graphics_context).m_jx,dbg_object(bb_graphics_context).m_jy,dbg_object(bb_graphics_context).m_tx,dbg_object(bb_graphics_context).m_ty);
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<38>";
		this.m_matDirty=0;
	}
	pop_err();
	return 0;
}
var bb_graphics_context=null;
function bb_data_FixDataPath(t_path){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<3>";
	var t_i=t_path.indexOf(":/",0);
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<4>";
	if(t_i!=-1 && t_path.indexOf("/",0)==t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/data.monkey<4>";
		pop_err();
		return t_path;
	}
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<5>";
	if(string_startswith(t_path,"./") || string_startswith(t_path,"/")){
		err_info="C:/MonkeyX77a/modules/mojo/data.monkey<5>";
		pop_err();
		return t_path;
	}
	err_info="C:/MonkeyX77a/modules/mojo/data.monkey<6>";
	var t_="monkey://data/"+t_path;
	pop_err();
	return t_;
}
function c_Frame(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
}
c_Frame.m_new=function(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<19>";
	dbg_object(this).m_x=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<20>";
	dbg_object(this).m_y=t_y;
	pop_err();
	return this;
}
c_Frame.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<14>";
	pop_err();
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<238>";
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<239>";
	if((t_surf)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<239>";
		var t_=(c_Image.m_new.call(new c_Image)).p_Init(t_surf,t_frameCount,t_flags);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<243>";
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<244>";
	if((t_surf)!=null){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<244>";
		var t_=(c_Image.m_new.call(new c_Image)).p_Init2(t_surf,0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags,null,0,0,t_surf.Width(),t_surf.Height());
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<545>";
	if(!((t_font)!=null)){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<546>";
		if(!((dbg_object(bb_graphics_context).m_defaultFont)!=null)){
			err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<547>";
			dbg_object(bb_graphics_context).m_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<549>";
		t_font=dbg_object(bb_graphics_context).m_defaultFont;
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<550>";
		t_firstChar=32;
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<552>";
	dbg_object(bb_graphics_context).m_font=t_font;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<553>";
	dbg_object(bb_graphics_context).m_firstChar=t_firstChar;
	pop_err();
	return 0;
}
var bb_audio_device=null;
function bb_audio_SetAudioDevice(t_dev){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/audio.monkey<18>";
	bb_audio_device=t_dev;
	pop_err();
	return 0;
}
function c_InputDevice(){
	Object.call(this);
	this.m__joyStates=new_object_array(4);
	this.m__keyDown=new_bool_array(512);
	this.m__keyHitPut=0;
	this.m__keyHitQueue=new_number_array(33);
	this.m__keyHit=new_number_array(512);
	this.m__charGet=0;
	this.m__charPut=0;
	this.m__charQueue=new_number_array(32);
	this.m__mouseX=.0;
	this.m__mouseY=.0;
	this.m__touchX=new_number_array(32);
	this.m__touchY=new_number_array(32);
	this.m__accelX=.0;
	this.m__accelY=.0;
	this.m__accelZ=.0;
}
c_InputDevice.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<22>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<23>";
		dbg_array(this.m__joyStates,t_i)[dbg_index]=c_JoyState.m_new.call(new c_JoyState)
	}
	pop_err();
	return this;
}
c_InputDevice.prototype.p_PutKeyHit=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<233>";
	if(this.m__keyHitPut==this.m__keyHitQueue.length){
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<234>";
	dbg_array(this.m__keyHit,t_key)[dbg_index]+=1
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<235>";
	dbg_array(this.m__keyHitQueue,this.m__keyHitPut)[dbg_index]=t_key
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<236>";
	this.m__keyHitPut+=1;
	pop_err();
}
c_InputDevice.prototype.p_BeginUpdate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<185>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<186>";
		var t_state=dbg_array(this.m__joyStates,t_i)[dbg_index];
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<187>";
		if(!BBGame.Game().PollJoystick(t_i,dbg_object(t_state).m_joyx,dbg_object(t_state).m_joyy,dbg_object(t_state).m_joyz,dbg_object(t_state).m_buttons)){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<187>";
			break;
		}
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<188>";
		for(var t_j=0;t_j<32;t_j=t_j+1){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<189>";
			var t_key=256+t_i*32+t_j;
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<190>";
			if(dbg_array(dbg_object(t_state).m_buttons,t_j)[dbg_index]){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<191>";
				if(!dbg_array(this.m__keyDown,t_key)[dbg_index]){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<192>";
					dbg_array(this.m__keyDown,t_key)[dbg_index]=true
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<193>";
					this.p_PutKeyHit(t_key);
				}
			}else{
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<196>";
				dbg_array(this.m__keyDown,t_key)[dbg_index]=false
			}
		}
	}
	pop_err();
}
c_InputDevice.prototype.p_EndUpdate=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<203>";
	for(var t_i=0;t_i<this.m__keyHitPut;t_i=t_i+1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<204>";
		dbg_array(this.m__keyHit,dbg_array(this.m__keyHitQueue,t_i)[dbg_index])[dbg_index]=0
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<206>";
	this.m__keyHitPut=0;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<207>";
	this.m__charGet=0;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<208>";
	this.m__charPut=0;
	pop_err();
}
c_InputDevice.prototype.p_KeyEvent=function(t_event,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<107>";
	var t_1=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<108>";
	if(t_1==1){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<109>";
		if(!dbg_array(this.m__keyDown,t_data)[dbg_index]){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<110>";
			dbg_array(this.m__keyDown,t_data)[dbg_index]=true
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<111>";
			this.p_PutKeyHit(t_data);
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<112>";
			if(t_data==1){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<113>";
				dbg_array(this.m__keyDown,384)[dbg_index]=true
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<114>";
				this.p_PutKeyHit(384);
			}else{
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<115>";
				if(t_data==384){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<116>";
					dbg_array(this.m__keyDown,1)[dbg_index]=true
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<117>";
					this.p_PutKeyHit(1);
				}
			}
		}
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<120>";
		if(t_1==2){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<121>";
			if(dbg_array(this.m__keyDown,t_data)[dbg_index]){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<122>";
				dbg_array(this.m__keyDown,t_data)[dbg_index]=false
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<123>";
				if(t_data==1){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<124>";
					dbg_array(this.m__keyDown,384)[dbg_index]=false
				}else{
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<125>";
					if(t_data==384){
						err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<126>";
						dbg_array(this.m__keyDown,1)[dbg_index]=false
					}
				}
			}
		}else{
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<129>";
			if(t_1==3){
				err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<130>";
				if(this.m__charPut<this.m__charQueue.length){
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<131>";
					dbg_array(this.m__charQueue,this.m__charPut)[dbg_index]=t_data
					err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<132>";
					this.m__charPut+=1;
				}
			}
		}
	}
	pop_err();
}
c_InputDevice.prototype.p_MouseEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<138>";
	var t_2=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<139>";
	if(t_2==4){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<140>";
		this.p_KeyEvent(1,1+t_data);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<141>";
		if(t_2==5){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<142>";
			this.p_KeyEvent(2,1+t_data);
			pop_err();
			return;
		}else{
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<144>";
			if(t_2==6){
			}else{
				pop_err();
				return;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<148>";
	this.m__mouseX=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<149>";
	this.m__mouseY=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<150>";
	dbg_array(this.m__touchX,0)[dbg_index]=t_x
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<151>";
	dbg_array(this.m__touchY,0)[dbg_index]=t_y
	pop_err();
}
c_InputDevice.prototype.p_TouchEvent=function(t_event,t_data,t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<155>";
	var t_3=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<156>";
	if(t_3==7){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<157>";
		this.p_KeyEvent(1,384+t_data);
	}else{
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<158>";
		if(t_3==8){
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<159>";
			this.p_KeyEvent(2,384+t_data);
			pop_err();
			return;
		}else{
			err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<161>";
			if(t_3==9){
			}else{
				pop_err();
				return;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<165>";
	dbg_array(this.m__touchX,t_data)[dbg_index]=t_x
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<166>";
	dbg_array(this.m__touchY,t_data)[dbg_index]=t_y
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<167>";
	if(t_data==0){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<168>";
		this.m__mouseX=t_x;
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<169>";
		this.m__mouseY=t_y;
	}
	pop_err();
}
c_InputDevice.prototype.p_MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<174>";
	var t_4=t_event;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<175>";
	if(t_4==10){
	}else{
		pop_err();
		return;
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<179>";
	this.m__accelX=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<180>";
	this.m__accelY=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<181>";
	this.m__accelZ=t_z;
	pop_err();
}
c_InputDevice.prototype.p_SetKeyboardEnabled=function(t_enabled){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<38>";
	BBGame.Game().SetKeyboardEnabled(t_enabled);
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<39>";
	pop_err();
	return 1;
}
c_InputDevice.prototype.p_GetChar=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<53>";
	if(this.m__charGet==this.m__charPut){
		err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<53>";
		pop_err();
		return 0;
	}
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<54>";
	var t_chr=dbg_array(this.m__charQueue,this.m__charGet)[dbg_index];
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<55>";
	this.m__charGet+=1;
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<56>";
	pop_err();
	return t_chr;
}
function c_JoyState(){
	Object.call(this);
	this.m_joyx=new_number_array(2);
	this.m_joyy=new_number_array(2);
	this.m_joyz=new_number_array(2);
	this.m_buttons=new_bool_array(32);
}
c_JoyState.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/inputdevice.monkey<10>";
	pop_err();
	return this;
}
var bb_input_device=null;
function bb_input_SetInputDevice(t_dev){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<18>";
	bb_input_device=t_dev;
	pop_err();
	return 0;
}
var bb_graphics_renderDevice=null;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<311>";
	dbg_object(bb_graphics_context).m_ix=t_ix;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<312>";
	dbg_object(bb_graphics_context).m_iy=t_iy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<313>";
	dbg_object(bb_graphics_context).m_jx=t_jx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<314>";
	dbg_object(bb_graphics_context).m_jy=t_jy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<315>";
	dbg_object(bb_graphics_context).m_tx=t_tx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<316>";
	dbg_object(bb_graphics_context).m_ty=t_ty;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<317>";
	dbg_object(bb_graphics_context).m_tformed=((t_ix!=1.0 || t_iy!=0.0 || t_jx!=0.0 || t_jy!=1.0 || t_tx!=0.0 || t_ty!=0.0)?1:0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<318>";
	dbg_object(bb_graphics_context).m_matDirty=1;
	pop_err();
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<307>";
	bb_graphics_SetMatrix(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<253>";
	dbg_object(bb_graphics_context).m_color_r=t_r;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<254>";
	dbg_object(bb_graphics_context).m_color_g=t_g;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<255>";
	dbg_object(bb_graphics_context).m_color_b=t_b;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<256>";
	bb_graphics_renderDevice.SetColor(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<270>";
	dbg_object(bb_graphics_context).m_alpha=t_alpha;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<271>";
	bb_graphics_renderDevice.SetAlpha(t_alpha);
	pop_err();
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<279>";
	dbg_object(bb_graphics_context).m_blend=t_blend;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<280>";
	bb_graphics_renderDevice.SetBlend(t_blend);
	pop_err();
	return 0;
}
function bb_graphics_DeviceWidth(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<230>";
	var t_=bb_graphics_device.Width();
	pop_err();
	return t_;
}
function bb_graphics_DeviceHeight(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<234>";
	var t_=bb_graphics_device.Height();
	pop_err();
	return t_;
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<288>";
	dbg_object(bb_graphics_context).m_scissor_x=t_x;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<289>";
	dbg_object(bb_graphics_context).m_scissor_y=t_y;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<290>";
	dbg_object(bb_graphics_context).m_scissor_width=t_width;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<291>";
	dbg_object(bb_graphics_context).m_scissor_height=t_height;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<292>";
	bb_graphics_renderDevice.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	pop_err();
	return 0;
}
function bb_graphics_BeginRender(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<216>";
	bb_graphics_renderDevice=bb_graphics_device;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<217>";
	dbg_object(bb_graphics_context).m_matrixSp=0;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<218>";
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<219>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<220>";
	bb_graphics_SetAlpha(1.0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<221>";
	bb_graphics_SetBlend(0);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<222>";
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	pop_err();
	return 0;
}
function bb_graphics_EndRender(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<226>";
	bb_graphics_renderDevice=null;
	pop_err();
	return 0;
}
function c_BBGameEvent(){
	Object.call(this);
}
function bb_app_EndApp(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<186>";
	error("");
	pop_err();
	return 0;
}
function c_AngelFontExample(){
	Object.call(this);
	this.m_font=null;
	this.m_inp=null;
	this.m_textBoxText="";
}
c_AngelFontExample.m_new=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<38>";
	pop_err();
	return this;
}
c_AngelFontExample.prototype.p_OnCreate=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<47>";
	bb_app_SetUpdateRate(30);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<49>";
	bb_input_EnableKeyboard();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<51>";
	this.m_font=c_AngelFont.m_new.call(new c_AngelFont,"");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<53>";
	dbg_object(this.m_font).m_italicSkew=0.15;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<59>";
	this.m_font.p_LoadFontXml("pagedfont");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<62>";
	this.m_inp=c_SimpleInput.m_new.call(new c_SimpleInput,"simple input",0,0);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<65>";
	this.m_textBoxText="You will notice you are unable to move. Your only ability is the ninjah rope for this level. At the bottom right of the screen you will see three ability icons. Move, lets you move left and right. Rope, lets you use your ninjah rope. Gun, lets you boost.";
	pop_err();
	return 0;
}
c_AngelFontExample.prototype.p_OnUpdate=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<72>";
	this.m_inp.p_Update();
	pop_err();
	return 0;
}
c_AngelFontExample.prototype.p_OnRender=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<77>";
	bb_graphics_Cls(80.0,80.0,80.0);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<80>";
	this.m_font.p_DrawHTML("Testing angel fonts <i>Italic</i> <b>Bold <i>Both</i></b>",5,5);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<82>";
	bb_graphics_SetColor(255.0,255.0,50.0);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<83>";
	this.m_inp.p_Draw2(5,45);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<88>";
	bb_graphics_PushMatrix();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<89>";
	bb_graphics_Scale(0.75,0.75);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<91>";
	c_SimpleTextBox.m_DrawHTML(this.m_textBoxText,426,180,832,1);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont_example.monkey<93>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
var bb_app__updateRate=0;
function bb_app_SetUpdateRate(t_hertz){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<151>";
	bb_app__updateRate=t_hertz;
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<152>";
	bb_app__game.SetUpdateRate(t_hertz);
	pop_err();
	return 0;
}
function bb_input_EnableKeyboard(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<28>";
	var t_=bb_input_device.p_SetKeyboardEnabled(true);
	pop_err();
	return t_;
}
function c_AngelFont(){
	Object.call(this);
	this.m_iniText="";
	this.m_kernPairs=c_IntMap2.m_new.call(new c_IntMap2);
	this.m_chars=new_object_array(256);
	this.m_height=0;
	this.m_heightOffset=9999;
	this.m_image=new_object_array(1);
	this.m_name="";
	this.m_italicSkew=0.25;
	this.m_xOffset=0;
	this.m_useKerning=true;
}
c_AngelFont.m_err="";
c_AngelFont.m_current=null;
c_AngelFont.m_firstKp=null;
c_AngelFont.prototype.p_LoadFont=function(t_url){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<76>";
	c_AngelFont.m_err="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<77>";
	c_AngelFont.m_current=this;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<78>";
	this.m_iniText=bb_app_LoadString(t_url+".txt");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<79>";
	var t_lines=this.m_iniText.split(String.fromCharCode(10));
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<80>";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<80>";
	var t_=t_lines;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<80>";
	var t_2=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<80>";
	while(t_2<t_.length){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<80>";
		var t_line=dbg_array(t_,t_2)[dbg_index];
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<80>";
		t_2=t_2+1;
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<82>";
		t_line=string_trim(t_line);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<84>";
		if(string_startswith(t_line,"id,") || t_line==""){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<84>";
			continue;
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<85>";
		if(string_startswith(t_line,"first,")){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<87>";
			continue;
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<89>";
		var t_data=t_line.split(",");
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<91>";
		for(var t_i=0;t_i<t_data.length;t_i=t_i+1){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<92>";
			dbg_array(t_data,t_i)[dbg_index]=string_trim(dbg_array(t_data,t_i)[dbg_index])
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<95>";
		c_AngelFont.m_err=c_AngelFont.m_err+(String(t_data.length)+",");
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<96>";
		if(t_data.length>0){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<97>";
			if(t_data.length==3){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<102>";
				var t_first=parseInt((dbg_array(t_data,0)[dbg_index]),10);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<103>";
				c_AngelFont.m_firstKp=this.m_kernPairs.p_Get(t_first);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<104>";
				if(c_AngelFont.m_firstKp==null){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<105>";
					this.m_kernPairs.p_Add2(t_first,c_IntMap.m_new.call(new c_IntMap));
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<106>";
					c_AngelFont.m_firstKp=this.m_kernPairs.p_Get(t_first);
				}
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<109>";
				var t_second=parseInt((dbg_array(t_data,1)[dbg_index]),10);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<111>";
				c_AngelFont.m_firstKp.p_Add(t_second,c_KernPair.m_new.call(new c_KernPair,parseInt((dbg_array(t_data,0)[dbg_index]),10),parseInt((dbg_array(t_data,1)[dbg_index]),10),parseInt((dbg_array(t_data,2)[dbg_index]),10)));
			}else{
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<114>";
				if(t_data.length>=8){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<115>";
					dbg_array(this.m_chars,parseInt((dbg_array(t_data,0)[dbg_index]),10))[dbg_index]=c_Char.m_new.call(new c_Char,parseInt((dbg_array(t_data,1)[dbg_index]),10),parseInt((dbg_array(t_data,2)[dbg_index]),10),parseInt((dbg_array(t_data,3)[dbg_index]),10),parseInt((dbg_array(t_data,4)[dbg_index]),10),parseInt((dbg_array(t_data,5)[dbg_index]),10),parseInt((dbg_array(t_data,6)[dbg_index]),10),parseInt((dbg_array(t_data,7)[dbg_index]),10),parseInt((dbg_array(t_data,8)[dbg_index]),10))
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<116>";
					var t_ch=dbg_array(this.m_chars,parseInt((dbg_array(t_data,0)[dbg_index]),10))[dbg_index];
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<117>";
					if(dbg_object(t_ch).m_height>dbg_object(this).m_height){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<117>";
						dbg_object(this).m_height=dbg_object(t_ch).m_height;
					}
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<118>";
					if(dbg_object(t_ch).m_yOffset<dbg_object(this).m_heightOffset){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<118>";
						dbg_object(this).m_heightOffset=dbg_object(t_ch).m_yOffset;
					}
				}
			}
		}
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<125>";
	dbg_array(this.m_image,0)[dbg_index]=bb_graphics_LoadImage(t_url+".png",1,c_Image.m_DefaultFlags)
	pop_err();
}
c_AngelFont.m__list=null;
c_AngelFont.m_new=function(t_url){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<63>";
	if(t_url!=""){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<64>";
		this.p_LoadFont(t_url);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<65>";
		dbg_object(this).m_name=t_url;
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<66>";
		c_AngelFont.m__list.p_Insert(t_url,this);
	}
	pop_err();
	return this;
}
c_AngelFont.prototype.p_LoadFontXml=function(t_url){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<129>";
	c_AngelFont.m_current=this;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<131>";
	this.m_iniText=bb_app_LoadString(t_url+".fnt");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<132>";
	var t_lines=this.m_iniText.split(String.fromCharCode(10));
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<133>";
	var t_firstLine=dbg_array(t_lines,0)[dbg_index];
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<135>";
	if(t_firstLine.indexOf("<?xml")!=-1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<136>";
		var t_lineList=c_List.m_new2.call(new c_List,t_lines);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<137>";
		t_lineList.p_RemoveFirst();
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<138>";
		t_lines=t_lineList.p_ToArray();
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<139>";
		this.m_iniText=t_lines.join("\n");
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<143>";
	var t_pageCount=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<145>";
	var t_config=bb_config_LoadConfig(this.m_iniText);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<147>";
	var t_nodes=t_config.p_FindNodesByPath("font/chars/char");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<148>";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<148>";
	var t_=t_nodes.p_ObjectEnumerator();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<148>";
	while(t_.p_HasNext()){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<148>";
		var t_node=t_.p_NextObject();
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<151>";
		var t_id=parseInt((t_node.p_GetAttribute("id","")),10);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<152>";
		var t_page=parseInt((t_node.p_GetAttribute("page","")),10);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<153>";
		if(t_pageCount<t_page){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<153>";
			t_pageCount=t_page;
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<154>";
		dbg_array(this.m_chars,t_id)[dbg_index]=c_Char.m_new.call(new c_Char,parseInt((t_node.p_GetAttribute("x","")),10),parseInt((t_node.p_GetAttribute("y","")),10),parseInt((t_node.p_GetAttribute("width","")),10),parseInt((t_node.p_GetAttribute("height","")),10),parseInt((t_node.p_GetAttribute("xoffset","")),10),parseInt((t_node.p_GetAttribute("yoffset","")),10),parseInt((t_node.p_GetAttribute("xadvance","")),10),t_page)
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<155>";
		var t_ch=dbg_array(this.m_chars,t_id)[dbg_index];
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<156>";
		if(dbg_object(t_ch).m_height>dbg_object(this).m_height){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<156>";
			dbg_object(this).m_height=dbg_object(t_ch).m_height;
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<157>";
		if(dbg_object(t_ch).m_yOffset<dbg_object(this).m_heightOffset){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<157>";
			dbg_object(this).m_heightOffset=dbg_object(t_ch).m_yOffset;
		}
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<160>";
	t_nodes=t_config.p_FindNodesByPath("font/kernings/kerning");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<161>";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<161>";
	var t_2=t_nodes.p_ObjectEnumerator();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<161>";
	while(t_2.p_HasNext()){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<161>";
		var t_node2=t_2.p_NextObject();
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<164>";
		var t_first=parseInt((t_node2.p_GetAttribute("first","")),10);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<165>";
		c_AngelFont.m_firstKp=this.m_kernPairs.p_Get(t_first);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<166>";
		if(c_AngelFont.m_firstKp==null){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<167>";
			this.m_kernPairs.p_Add2(t_first,c_IntMap.m_new.call(new c_IntMap));
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<168>";
			c_AngelFont.m_firstKp=this.m_kernPairs.p_Get(t_first);
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<171>";
		var t_second=parseInt((t_node2.p_GetAttribute("second","")),10);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<175>";
		c_AngelFont.m_firstKp.p_Add(t_second,c_KernPair.m_new.call(new c_KernPair,t_first,t_second,parseInt((t_node2.p_GetAttribute("amount","")),10)));
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<179>";
	if(t_pageCount==0){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<180>";
		dbg_array(this.m_image,0)[dbg_index]=bb_graphics_LoadImage(t_url+".png",1,c_Image.m_DefaultFlags)
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<181>";
		if(dbg_array(this.m_image,0)[dbg_index]==null){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<181>";
			dbg_array(this.m_image,0)[dbg_index]=bb_graphics_LoadImage(t_url+"_0.png",1,c_Image.m_DefaultFlags)
		}
	}else{
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<183>";
		for(var t_page2=0;t_page2<=t_pageCount;t_page2=t_page2+1){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<184>";
			if(this.m_image.length<t_page2+1){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<184>";
				this.m_image=resize_object_array(this.m_image,t_page2+1);
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<185>";
			dbg_array(this.m_image,t_page2)[dbg_index]=bb_graphics_LoadImage(t_url+"_"+String(t_page2)+".png",1,c_Image.m_DefaultFlags)
		}
	}
	pop_err();
}
c_AngelFont.m_GetCurrent=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<197>";
	pop_err();
	return c_AngelFont.m_current;
}
c_AngelFont.prototype.p_TextHeight=function(t_txt){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<383>";
	var t_h=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<384>";
	for(var t_i=0;t_i<t_txt.length;t_i=t_i+1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<385>";
		var t_asc=dbg_charCodeAt(t_txt,t_i);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<386>";
		var t_ac=dbg_array(this.m_chars,t_asc)[dbg_index];
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<387>";
		if(dbg_object(t_ac).m_height+dbg_object(t_ac).m_yOffset>t_h){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<387>";
			t_h=dbg_object(t_ac).m_height+dbg_object(t_ac).m_yOffset;
		}
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<389>";
	pop_err();
	return t_h;
}
c_AngelFont.m_secondKp=null;
c_AngelFont.prototype.p_DrawHTML=function(t_txt,t_x,t_y){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<269>";
	var t_prevChar=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<270>";
	this.m_xOffset=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<271>";
	var t_italic=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<272>";
	var t_bold=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<273>";
	var t_th=(this.p_TextHeight(t_txt));
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<275>";
	for(var t_i=0;t_i<t_txt.length;t_i=t_i+1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<278>";
		while(t_txt.slice(t_i,t_i+1)=="<"){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<279>";
			var t_2=t_txt.slice(t_i+1,t_i+3);
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<280>";
			if(t_2=="i>"){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<281>";
				t_italic=true;
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<282>";
				t_i+=3;
			}else{
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<283>";
				if(t_2=="b>"){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<284>";
					t_bold=true;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<285>";
					t_i+=3;
				}else{
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<287>";
					var t_3=t_txt.slice(t_i+1,t_i+4);
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<288>";
					if(t_3=="/i>"){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<289>";
						t_italic=false;
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<290>";
						t_i+=4;
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<291>";
						if(t_3=="/b>"){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<292>";
							t_bold=false;
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<293>";
							t_i+=4;
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<295>";
							t_i+=1;
						}
					}
				}
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<298>";
			if(t_i>=t_txt.length){
				pop_err();
				return;
			}
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<302>";
		var t_asc=dbg_charCodeAt(t_txt,t_i);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<303>";
		var t_ac=dbg_array(this.m_chars,t_asc)[dbg_index];
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<305>";
		var t_thisChar=t_asc;
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<306>";
		if(t_ac!=null){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<307>";
			if(this.m_useKerning){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<308>";
				c_AngelFont.m_firstKp=this.m_kernPairs.p_Get(t_prevChar);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<309>";
				if(c_AngelFont.m_firstKp!=null){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<310>";
					c_AngelFont.m_secondKp=c_AngelFont.m_firstKp.p_Get(t_thisChar);
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<311>";
					if(c_AngelFont.m_secondKp!=null){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<312>";
						this.m_xOffset+=dbg_object(c_AngelFont.m_secondKp).m_amount;
					}
				}
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<317>";
			if(t_italic==false){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<318>";
				t_ac.p_Draw(dbg_array(this.m_image,dbg_object(t_ac).m_page)[dbg_index],t_x+this.m_xOffset,t_y);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<319>";
				if(t_bold){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<320>";
					t_ac.p_Draw(dbg_array(this.m_image,dbg_object(t_ac).m_page)[dbg_index],t_x+this.m_xOffset+1,t_y);
				}
			}else{
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<323>";
				bb_graphics_PushMatrix();
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<324>";
				bb_graphics_Transform(1.0,0.0,-this.m_italicSkew,1.0,(t_x+this.m_xOffset)+t_th*this.m_italicSkew,(t_y));
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<325>";
				t_ac.p_Draw(dbg_array(this.m_image,dbg_object(t_ac).m_page)[dbg_index],0,0);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<326>";
				if(t_bold){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<327>";
					t_ac.p_Draw(dbg_array(this.m_image,dbg_object(t_ac).m_page)[dbg_index],1,0);
				}
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<329>";
				bb_graphics_PopMatrix();
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<331>";
			this.m_xOffset+=dbg_object(t_ac).m_xAdvance;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<332>";
			t_prevChar=t_thisChar;
		}
	}
	pop_err();
}
c_AngelFont.m_StripHTML=function(t_txt){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<350>";
	var t_plainText=string_replace(t_txt,"</","<");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<351>";
	t_plainText=string_replace(t_plainText,"<b>","");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<352>";
	var t_=string_replace(t_plainText,"<i>","");
	pop_err();
	return t_;
}
c_AngelFont.prototype.p_TextWidth=function(t_txt){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<357>";
	var t_prevChar=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<358>";
	var t_width=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<359>";
	for(var t_i=0;t_i<t_txt.length;t_i=t_i+1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<360>";
		var t_asc=dbg_charCodeAt(t_txt,t_i);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<361>";
		var t_ac=dbg_array(this.m_chars,t_asc)[dbg_index];
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<363>";
		var t_thisChar=t_asc;
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<364>";
		if(t_ac!=null){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<365>";
			if(this.m_useKerning){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<366>";
				var t_firstKp=this.m_kernPairs.p_Get(t_prevChar);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<367>";
				if(t_firstKp!=null){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<368>";
					var t_secondKp=t_firstKp.p_Get(t_thisChar);
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<369>";
					if(t_secondKp!=null){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<370>";
						this.m_xOffset+=dbg_object(t_secondKp).m_amount;
					}
				}
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<375>";
			t_width+=dbg_object(t_ac).m_xAdvance;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<376>";
			t_prevChar=t_thisChar;
		}
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<379>";
	pop_err();
	return t_width;
}
c_AngelFont.prototype.p_DrawHTML2=function(t_txt,t_x,t_y,t_align){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<338>";
	this.m_xOffset=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<339>";
	var t_4=t_align;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<340>";
	if(t_4==1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<341>";
		this.p_DrawHTML(t_txt,t_x-((this.p_TextWidth(c_AngelFont.m_StripHTML(t_txt))/2)|0),t_y);
	}else{
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<342>";
		if(t_4==2){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<343>";
			this.p_DrawHTML(t_txt,t_x-this.p_TextWidth(c_AngelFont.m_StripHTML(t_txt)),t_y);
		}else{
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<344>";
			if(t_4==0){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<345>";
				this.p_DrawHTML(t_txt,t_x,t_y);
			}
		}
	}
	pop_err();
}
c_AngelFont.prototype.p_DrawText=function(t_txt,t_x,t_y){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<229>";
	var t_prevChar=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<230>";
	this.m_xOffset=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<232>";
	for(var t_i=0;t_i<t_txt.length;t_i=t_i+1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<233>";
		var t_asc=dbg_charCodeAt(t_txt,t_i);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<234>";
		var t_ac=dbg_array(this.m_chars,t_asc)[dbg_index];
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<236>";
		var t_thisChar=t_asc;
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<237>";
		if(t_ac!=null){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<238>";
			if(this.m_useKerning){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<239>";
				c_AngelFont.m_firstKp=this.m_kernPairs.p_Get(t_prevChar);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<240>";
				if(c_AngelFont.m_firstKp!=null){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<241>";
					c_AngelFont.m_secondKp=c_AngelFont.m_firstKp.p_Get(t_thisChar);
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<242>";
					if(c_AngelFont.m_secondKp!=null){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<243>";
						this.m_xOffset+=dbg_object(c_AngelFont.m_secondKp).m_amount;
					}
				}
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<248>";
			t_ac.p_Draw(dbg_array(this.m_image,dbg_object(t_ac).m_page)[dbg_index],t_x+this.m_xOffset,t_y);
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<249>";
			this.m_xOffset+=dbg_object(t_ac).m_xAdvance;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<250>";
			t_prevChar=t_thisChar;
		}
	}
	pop_err();
}
c_AngelFont.prototype.p_DrawText2=function(t_txt,t_x,t_y,t_align){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<256>";
	this.m_xOffset=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<257>";
	var t_1=t_align;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<258>";
	if(t_1==1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<259>";
		this.p_DrawText(t_txt,t_x-((this.p_TextWidth(t_txt)/2)|0),t_y);
	}else{
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<260>";
		if(t_1==2){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<261>";
			this.p_DrawText(t_txt,t_x-this.p_TextWidth(t_txt),t_y);
		}else{
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<262>";
			if(t_1==0){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<263>";
				this.p_DrawText(t_txt,t_x,t_y);
			}
		}
	}
	pop_err();
}
c_AngelFont.prototype.p_GetChars=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/angelfont.monkey<71>";
	pop_err();
	return this.m_chars;
}
function bb_app_LoadString(t_path){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/app.monkey<147>";
	var t_=bb_app__game.LoadString(bb_data_FixDataPath(t_path));
	pop_err();
	return t_;
}
function c_KernPair(){
	Object.call(this);
	this.m_first="";
	this.m_second="";
	this.m_amount=0;
}
c_KernPair.m_new=function(t_first,t_second,t_amount){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/kernpair.monkey<9>";
	dbg_object(this).m_first=String(t_first);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/kernpair.monkey<10>";
	dbg_object(this).m_second=String(t_second);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/kernpair.monkey<11>";
	dbg_object(this).m_amount=t_amount;
	pop_err();
	return this;
}
c_KernPair.m_new2=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/kernpair.monkey<2>";
	pop_err();
	return this;
}
function c_Map(){
	Object.call(this);
	this.m_root=null;
}
c_Map.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
c_Map.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map.prototype.p_RotateLeft=function(t_node){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).m_right;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<252>";
	dbg_object(t_node).m_right=dbg_object(t_child).m_left;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).m_left)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).m_left).m_parent=t_node;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<256>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}
	}else{
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<264>";
		this.m_root=t_child;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<266>";
	dbg_object(t_child).m_left=t_node;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<267>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map.prototype.p_RotateRight=function(t_node){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).m_left;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<272>";
	dbg_object(t_node).m_left=dbg_object(t_child).m_right;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).m_right)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).m_right).m_parent=t_node;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<276>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}
	}else{
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<284>";
		this.m_root=t_child;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<286>";
	dbg_object(t_child).m_right=t_node;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<287>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map.prototype.p_InsertFixup=function(t_node){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).m_parent)!=null) && dbg_object(dbg_object(t_node).m_parent).m_color==-1 && ((dbg_object(dbg_object(t_node).m_parent).m_parent)!=null)){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).m_parent==dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_right;
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).m_color==-1){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).m_parent;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).m_parent;
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<223>";
					this.p_RotateLeft(t_node);
				}
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<227>";
				this.p_RotateRight(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left;
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).m_color==-1){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).m_parent;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).m_parent;
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<239>";
					this.p_RotateRight(t_node);
				}
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<243>";
				this.p_RotateLeft(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<247>";
	dbg_object(this.m_root).m_color=1;
	pop_err();
	return 0;
}
c_Map.prototype.p_Add=function(t_key,t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<61>";
	var t_node=this.m_root;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<62>";
	var t_parent=null;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<62>";
	var t_cmp=0;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<64>";
	while((t_node)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<65>";
		t_parent=t_node;
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<66>";
		t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<67>";
		if(t_cmp>0){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<68>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<69>";
			if(t_cmp<0){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<70>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<72>";
				pop_err();
				return false;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<76>";
	t_node=c_Node2.m_new.call(new c_Node2,t_key,t_value,-1,t_parent);
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<78>";
	if((t_parent)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<79>";
		if(t_cmp>0){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<80>";
			dbg_object(t_parent).m_right=t_node;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<82>";
			dbg_object(t_parent).m_left=t_node;
		}
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<84>";
		this.p_InsertFixup(t_node);
	}else{
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<86>";
		this.m_root=t_node;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<88>";
	pop_err();
	return true;
}
c_Map.prototype.p_FindNode=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<157>";
	var t_node=this.m_root;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<160>";
		var t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
c_Map.prototype.p_Get=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<101>";
	var t_node=this.p_FindNode(t_key);
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).m_value;
	}
	pop_err();
	return null;
}
function c_IntMap(){
	c_Map.call(this);
}
c_IntMap.prototype=extend_class(c_Map);
c_IntMap.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<534>";
	c_Map.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<534>";
	pop_err();
	return this;
}
c_IntMap.prototype.p_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<537>";
	var t_=t_lhs-t_rhs;
	pop_err();
	return t_;
}
function c_Map2(){
	Object.call(this);
	this.m_root=null;
}
c_Map2.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
c_Map2.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map2.prototype.p_FindNode=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<157>";
	var t_node=this.m_root;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<160>";
		var t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
c_Map2.prototype.p_Get=function(t_key){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<101>";
	var t_node=this.p_FindNode(t_key);
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).m_value;
	}
	pop_err();
	return null;
}
c_Map2.prototype.p_RotateLeft2=function(t_node){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).m_right;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<252>";
	dbg_object(t_node).m_right=dbg_object(t_child).m_left;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).m_left)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).m_left).m_parent=t_node;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<256>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}
	}else{
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<264>";
		this.m_root=t_child;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<266>";
	dbg_object(t_child).m_left=t_node;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<267>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map2.prototype.p_RotateRight2=function(t_node){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).m_left;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<272>";
	dbg_object(t_node).m_left=dbg_object(t_child).m_right;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).m_right)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).m_right).m_parent=t_node;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<276>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}
	}else{
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<284>";
		this.m_root=t_child;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<286>";
	dbg_object(t_child).m_right=t_node;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<287>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map2.prototype.p_InsertFixup2=function(t_node){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).m_parent)!=null) && dbg_object(dbg_object(t_node).m_parent).m_color==-1 && ((dbg_object(dbg_object(t_node).m_parent).m_parent)!=null)){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).m_parent==dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_right;
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).m_color==-1){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).m_parent;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).m_parent;
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<223>";
					this.p_RotateLeft2(t_node);
				}
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<227>";
				this.p_RotateRight2(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left;
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).m_color==-1){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).m_parent;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).m_parent;
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<239>";
					this.p_RotateRight2(t_node);
				}
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<243>";
				this.p_RotateLeft2(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<247>";
	dbg_object(this.m_root).m_color=1;
	pop_err();
	return 0;
}
c_Map2.prototype.p_Add2=function(t_key,t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<61>";
	var t_node=this.m_root;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<62>";
	var t_parent=null;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<62>";
	var t_cmp=0;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<64>";
	while((t_node)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<65>";
		t_parent=t_node;
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<66>";
		t_cmp=this.p_Compare(t_key,dbg_object(t_node).m_key);
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<67>";
		if(t_cmp>0){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<68>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<69>";
			if(t_cmp<0){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<70>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<72>";
				pop_err();
				return false;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<76>";
	t_node=c_Node.m_new.call(new c_Node,t_key,t_value,-1,t_parent);
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<78>";
	if((t_parent)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<79>";
		if(t_cmp>0){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<80>";
			dbg_object(t_parent).m_right=t_node;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<82>";
			dbg_object(t_parent).m_left=t_node;
		}
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<84>";
		this.p_InsertFixup2(t_node);
	}else{
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<86>";
		this.m_root=t_node;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<88>";
	pop_err();
	return true;
}
function c_IntMap2(){
	c_Map2.call(this);
}
c_IntMap2.prototype=extend_class(c_Map2);
c_IntMap2.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<534>";
	c_Map2.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<534>";
	pop_err();
	return this;
}
c_IntMap2.prototype.p_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<537>";
	var t_=t_lhs-t_rhs;
	pop_err();
	return t_;
}
function c_Node(){
	Object.call(this);
	this.m_key=0;
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node.m_new=function(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<364>";
	dbg_object(this).m_key=t_key;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<365>";
	dbg_object(this).m_value=t_value;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<366>";
	dbg_object(this).m_color=t_color;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<367>";
	dbg_object(this).m_parent=t_parent;
	pop_err();
	return this;
}
c_Node.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function c_Node2(){
	Object.call(this);
	this.m_key=0;
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node2.m_new=function(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<364>";
	dbg_object(this).m_key=t_key;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<365>";
	dbg_object(this).m_value=t_value;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<366>";
	dbg_object(this).m_color=t_color;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<367>";
	dbg_object(this).m_parent=t_parent;
	pop_err();
	return this;
}
c_Node2.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function c_Char(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
	this.m_width=0;
	this.m_height=0;
	this.m_xOffset=0;
	this.m_yOffset=0;
	this.m_xAdvance=0;
	this.m_page=0;
}
c_Char.m_new=function(t_x,t_y,t_w,t_h,t_xoff,t_yoff,t_xadv,t_page){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<19>";
	dbg_object(this).m_x=t_x;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<20>";
	dbg_object(this).m_y=t_y;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<21>";
	dbg_object(this).m_width=t_w;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<22>";
	dbg_object(this).m_height=t_h;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<24>";
	dbg_object(this).m_xOffset=t_xoff;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<25>";
	dbg_object(this).m_yOffset=t_yoff;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<26>";
	dbg_object(this).m_xAdvance=t_xadv;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<27>";
	dbg_object(this).m_page=t_page;
	pop_err();
	return this;
}
c_Char.m_new2=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<3>";
	pop_err();
	return this;
}
c_Char.prototype.p_Draw=function(t_fontImage,t_linex,t_liney){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/char.monkey<31>";
	bb_graphics_DrawImageRect(t_fontImage,(t_linex+this.m_xOffset),(t_liney+this.m_yOffset),this.m_x,this.m_y,this.m_width,this.m_height,0);
	pop_err();
	return 0;
}
function c_Map3(){
	Object.call(this);
	this.m_root=null;
}
c_Map3.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
c_Map3.prototype.p_Compare2=function(t_lhs,t_rhs){
}
c_Map3.prototype.p_RotateLeft3=function(t_node){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).m_right;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<252>";
	dbg_object(t_node).m_right=dbg_object(t_child).m_left;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).m_left)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).m_left).m_parent=t_node;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<256>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}
	}else{
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<264>";
		this.m_root=t_child;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<266>";
	dbg_object(t_child).m_left=t_node;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<267>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map3.prototype.p_RotateRight3=function(t_node){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).m_left;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<272>";
	dbg_object(t_node).m_left=dbg_object(t_child).m_right;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).m_right)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).m_right).m_parent=t_node;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<276>";
	dbg_object(t_child).m_parent=dbg_object(t_node).m_parent;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).m_parent)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).m_parent).m_right=t_child;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).m_parent).m_left=t_child;
		}
	}else{
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<284>";
		this.m_root=t_child;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<286>";
	dbg_object(t_child).m_right=t_node;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<287>";
	dbg_object(t_node).m_parent=t_child;
	pop_err();
	return 0;
}
c_Map3.prototype.p_InsertFixup3=function(t_node){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).m_parent)!=null) && dbg_object(dbg_object(t_node).m_parent).m_color==-1 && ((dbg_object(dbg_object(t_node).m_parent).m_parent)!=null)){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).m_parent==dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_right;
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).m_color==-1){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).m_parent;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_right){
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).m_parent;
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<223>";
					this.p_RotateLeft3(t_node);
				}
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<227>";
				this.p_RotateRight3(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_left;
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).m_color==-1){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).m_parent;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).m_parent).m_left){
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).m_parent;
					err_info="C:/MonkeyX77a/modules/monkey/map.monkey<239>";
					this.p_RotateRight3(t_node);
				}
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).m_parent).m_color=1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).m_parent).m_parent).m_color=-1;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<243>";
				this.p_RotateLeft3(dbg_object(dbg_object(t_node).m_parent).m_parent);
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<247>";
	dbg_object(this.m_root).m_color=1;
	pop_err();
	return 0;
}
c_Map3.prototype.p_Set=function(t_key,t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<29>";
	var t_node=this.m_root;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<34>";
		t_cmp=this.p_Compare2(t_key,dbg_object(t_node).m_key);
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).m_right;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).m_left;
			}else{
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<40>";
				dbg_object(t_node).m_value=t_value;
				err_info="C:/MonkeyX77a/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<45>";
	t_node=c_Node3.m_new.call(new c_Node3,t_key,t_value,-1,t_parent);
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).m_right=t_node;
		}else{
			err_info="C:/MonkeyX77a/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).m_left=t_node;
		}
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<53>";
		this.p_InsertFixup3(t_node);
	}else{
		err_info="C:/MonkeyX77a/modules/monkey/map.monkey<55>";
		this.m_root=t_node;
	}
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
c_Map3.prototype.p_Insert=function(t_key,t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<126>";
	var t_=this.p_Set(t_key,t_value);
	pop_err();
	return t_;
}
function c_StringMap(){
	c_Map3.call(this);
}
c_StringMap.prototype=extend_class(c_Map3);
c_StringMap.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<551>";
	c_Map3.m_new.call(this);
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
c_StringMap.prototype.p_Compare2=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
function c_Node3(){
	Object.call(this);
	this.m_key="";
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node3.m_new=function(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<364>";
	dbg_object(this).m_key=t_key;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<365>";
	dbg_object(this).m_value=t_value;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<366>";
	dbg_object(this).m_color=t_color;
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<367>";
	dbg_object(this).m_parent=t_parent;
	pop_err();
	return this;
}
c_Node3.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function c_List(){
	Object.call(this);
	this.m__head=(c_HeadNode.m_new.call(new c_HeadNode));
}
c_List.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List.prototype.p_AddLast=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<108>";
	var t_=c_Node4.m_new.call(new c_Node4,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List.m_new2=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<14>";
		this.p_AddLast(t_t);
	}
	pop_err();
	return this;
}
c_List.prototype.p_IsEmpty=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<50>";
	var t_=dbg_object(this.m__head).m__succ==this.m__head;
	pop_err();
	return t_;
}
c_List.prototype.p_RemoveFirst=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<87>";
	if(this.p_IsEmpty()){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<87>";
		error("Illegal operation on empty list");
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<89>";
	var t_data=dbg_object(dbg_object(this.m__head).m__succ).m__data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<90>";
	dbg_object(this.m__head).m__succ.p_Remove();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<91>";
	pop_err();
	return t_data;
}
c_List.prototype.p_Equals=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<28>";
	var t_=t_lhs==t_rhs;
	pop_err();
	return t_;
}
c_List.prototype.p_Find=function(t_value,t_start){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<116>";
	while(t_start!=this.m__head){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<117>";
		if(this.p_Equals(t_value,dbg_object(t_start).m__data)){
			err_info="C:/MonkeyX77a/modules/monkey/list.monkey<117>";
			pop_err();
			return t_start;
		}
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<118>";
		t_start=dbg_object(t_start).m__succ;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<120>";
	pop_err();
	return null;
}
c_List.prototype.p_Find2=function(t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<112>";
	var t_=this.p_Find(t_value,dbg_object(this.m__head).m__succ);
	pop_err();
	return t_;
}
c_List.prototype.p_RemoveFirst2=function(t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<141>";
	var t_node=this.p_Find2(t_value);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<142>";
	if((t_node)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<142>";
		t_node.p_Remove();
	}
	pop_err();
}
c_List.prototype.p_Count=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<41>";
	var t_n=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<41>";
	var t_node=dbg_object(this.m__head).m__succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<42>";
	while(t_node!=this.m__head){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<43>";
		t_node=dbg_object(t_node).m__succ;
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<44>";
		t_n+=1;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<46>";
	pop_err();
	return t_n;
}
c_List.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<186>";
	var t_=c_Enumerator.m_new.call(new c_Enumerator,this);
	pop_err();
	return t_;
}
c_List.prototype.p_ToArray=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<19>";
	var t_arr=new_string_array(this.p_Count());
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<19>";
	var t_i=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<20>";
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<20>";
	var t_=this.p_ObjectEnumerator();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<20>";
	while(t_.p_HasNext()){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<20>";
		var t_t=t_.p_NextObject();
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<21>";
		dbg_array(t_arr,t_i)[dbg_index]=t_t
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<22>";
		t_i+=1;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<24>";
	pop_err();
	return t_arr;
}
function c_Node4(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data="";
}
c_Node4.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<261>";
	this.m__succ=t_succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<262>";
	this.m__pred=t_pred;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<263>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<264>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<265>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node4.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<258>";
	pop_err();
	return this;
}
c_Node4.prototype.p_Remove=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<274>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<274>";
		error("Illegal operation on removed node");
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<276>";
	dbg_object(this.m__succ).m__pred=this.m__pred;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<277>";
	dbg_object(this.m__pred).m__succ=this.m__succ;
	pop_err();
	return 0;
}
function c_HeadNode(){
	c_Node4.call(this);
}
c_HeadNode.prototype=extend_class(c_Node4);
c_HeadNode.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<310>";
	c_Node4.m_new2.call(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<311>";
	this.m__succ=(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<312>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_Enumerator(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator.m_new=function(t_list){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<326>";
	this.m__list=t_list;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<327>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<323>";
	pop_err();
	return this;
}
c_Enumerator.prototype.p_HasNext=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<331>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<332>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<334>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator.prototype.p_NextObject=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<338>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<339>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<340>";
	pop_err();
	return t_data;
}
function c_ConfigNode(){
	Object.call(this);
	this.m_name="";
	this.m_attributes=null;
	this.m_children=null;
	this.m_value="";
	this.m_line=0;
	this.m_column=0;
	this.m_parent=null;
}
c_ConfigNode.m_new=function(t_name){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<51>";
	dbg_object(this).m_name=t_name;
	pop_err();
	return this;
}
c_ConfigNode.m_new2=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<40>";
	pop_err();
	return this;
}
c_ConfigNode.prototype.p_GetConfigAttribute=function(t_name){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<246>";
	if(this.m_attributes==null){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<246>";
		pop_err();
		return null;
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<249>";
	t_name=t_name.toLowerCase();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<252>";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<252>";
	var t_=this.m_attributes.p_ObjectEnumerator();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<252>";
	while(t_.p_HasNext()){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<252>";
		var t_attribute=t_.p_NextObject();
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<253>";
		if(t_name==dbg_object(t_attribute).m_name){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<253>";
			pop_err();
			return t_attribute;
		}
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<256>";
	pop_err();
	return null;
}
c_ConfigNode.prototype.p_SetAttribute=function(t_name,t_value){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<262>";
	if(this.m_attributes==null){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<262>";
		this.m_attributes=c_List3.m_new.call(new c_List3);
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<265>";
	var t_attribute=this.p_GetConfigAttribute(t_name);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<268>";
	if((t_attribute)!=null){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<270>";
		t_attribute.p_SetValue(t_value);
	}else{
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<273>";
		this.m_attributes.p_AddLast3(c_ConfigAttribute.m_new.call(new c_ConfigAttribute,t_name,t_value));
	}
	pop_err();
	return 0;
}
c_ConfigNode.prototype.p_AddChild=function(t_childNode){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<210>";
	dbg_object(t_childNode).m_parent=this;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<213>";
	if(this.m_children==null){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<213>";
		this.m_children=c_List2.m_new.call(new c_List2);
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<216>";
	this.m_children.p_AddLast2(t_childNode);
	pop_err();
	return 0;
}
c_ConfigNode.prototype.p_FindNodesByPath=function(t_path){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<137>";
	var t_pointerNodes=null;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<140>";
	if(t_path.length==0){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<141>";
		t_pointerNodes=c_List2.m_new.call(new c_List2);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<142>";
		t_pointerNodes.p_AddLast2(this);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<143>";
		pop_err();
		return t_pointerNodes;
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<147>";
	if(this.m_children==null){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<147>";
		pop_err();
		return null;
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<150>";
	var t_pathParts=t_path.toLowerCase().split("/");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<151>";
	t_pointerNodes=c_List2.m_new.call(new c_List2);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<152>";
	var t_newPointerNodes=c_List2.m_new.call(new c_List2);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<155>";
	t_pointerNodes.p_AddLast2(this);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<158>";
	for(var t_pathIndex=0;t_pathIndex<t_pathParts.length;t_pathIndex=t_pathIndex+1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<160>";
		if(dbg_array(t_pathParts,t_pathIndex)[dbg_index].length==0){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<160>";
			pop_err();
			return null;
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<163>";
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<163>";
		var t_=t_pointerNodes.p_ObjectEnumerator();
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<163>";
		while(t_.p_HasNext()){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<163>";
			var t_pointerNode=t_.p_NextObject();
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<165>";
			if((dbg_object(t_pointerNode).m_children)!=null){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<166>";
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<166>";
				var t_2=dbg_object(t_pointerNode).m_children.p_ObjectEnumerator();
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<166>";
				while(t_2.p_HasNext()){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<166>";
					var t_childNode=t_2.p_NextObject();
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<167>";
					if(dbg_object(t_childNode).m_name==dbg_array(t_pathParts,t_pathIndex)[dbg_index]){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<167>";
						t_newPointerNodes.p_AddLast2(t_childNode);
					}
				}
			}
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<171>";
		t_pointerNodes.p_Clear();
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<174>";
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<174>";
		var t_3=t_newPointerNodes.p_ObjectEnumerator();
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<174>";
		while(t_3.p_HasNext()){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<174>";
			var t_pointerNode2=t_3.p_NextObject();
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<175>";
			t_pointerNodes.p_AddLast2(t_pointerNode2);
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<177>";
		t_newPointerNodes.p_Clear();
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<181>";
	if(t_pointerNodes.p_IsEmpty()){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<181>";
		pop_err();
		return null;
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<182>";
	pop_err();
	return t_pointerNodes;
}
c_ConfigNode.prototype.p_GetAttribute=function(t_name,t_defaultValue){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<221>";
	var t_attribute=this.p_GetConfigAttribute(t_name);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<222>";
	if(t_attribute==null){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<222>";
		pop_err();
		return t_defaultValue;
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<223>";
	pop_err();
	return dbg_object(t_attribute).m_value;
}
function c_Config(){
	c_ConfigNode.call(this);
	this.m_path="";
	this.m_script="";
	this.m_error=null;
}
c_Config.prototype=extend_class(c_ConfigNode);
c_Config.m_new=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<424>";
	c_ConfigNode.m_new2.call(this);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<424>";
	pop_err();
	return this;
}
c_Config.prototype.p_SetError=function(t_message,t_line,t_column,t_data){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<923>";
	this.m_error=c_ConfigError.m_new.call(new c_ConfigError,t_message,this.m_path,t_data,t_line,t_column);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<924>";
	if((this.m_attributes)!=null){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<924>";
		this.m_attributes.p_Clear();
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<925>";
	if((this.m_children)!=null){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<925>";
		this.m_children.p_Clear();
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<926>";
	pop_err();
	return false;
}
c_Config.prototype.p_Parse=function(t_scriptRaw){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<433>";
	this.m_name="root";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<436>";
	this.m_script=string_replace(t_scriptRaw,"\r\n","\n");
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<439>";
	var t_stack=c_List2.m_new.call(new c_List2);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<440>";
	t_stack.p_AddLast2(this);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<443>";
	var t_stackTag=null;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<445>";
	var t_scriptLength=this.m_script.length;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<446>";
	var t_scriptIndex=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<448>";
	var t_findTagQuote=-1;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<449>";
	var t_findTagStart=-1;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<450>";
	var t_findTagStartSize=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<451>";
	var t_findTagTemp=-1;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<452>";
	var t_findTagEnd=-1;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<453>";
	var t_findTagEndSize=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<454>";
	var t_findTag=null;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<455>";
	var t_findAttribute=null;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<456>";
	var t_findQuoteCharacter=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<457>";
	var t_findTagLine=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<458>";
	var t_findTagColumn=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<459>";
	var t_findName="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<460>";
	var t_findOperator="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<461>";
	var t_findSegment="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<462>";
	var t_findWhitespace="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<463>";
	var t_findLine=1;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<464>";
	var t_findLineStart=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<465>";
	var t_findHasPair=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<466>";
	var t_findHasClose=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<467>";
	var t_findHasFirst=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<468>";
	var t_findHasStart=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<469>";
	var t_findHasName=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<470>";
	var t_findHasNameEnd=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<471>";
	var t_findHasEquals=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<472>";
	var t_findHasValue=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<473>";
	var t_findHasComment=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<474>";
	var t_findHasQuotes=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<475>";
	var t_findHasEnd=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<476>";
	var t_findHasSegment=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<477>";
	var t_findHasSegmentEnd=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<478>";
	var t_findHasOperator=false;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<481>";
	while(t_scriptIndex<t_scriptLength-1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<483>";
		for(var t_findIndex=t_scriptIndex;t_findIndex<t_scriptLength;t_findIndex=t_findIndex+1){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<485>";
			if(dbg_charCodeAt(this.m_script,t_findIndex)==10){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<486>";
				t_findLine+=1;
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<487>";
				t_findLineStart=t_findIndex+1;
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<491>";
			if(t_findHasStart==false){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<493>";
				if(t_findHasComment==false){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<495>";
					if(dbg_charCodeAt(this.m_script,t_findIndex)==60){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<498>";
						if(t_findIndex<t_scriptLength-4 && this.m_script.slice(t_findIndex,t_findIndex+4)=="<!--"){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<500>";
							t_findHasComment=true;
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<501>";
							t_findIndex+=3;
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<504>";
							if(t_findIndex<t_scriptLength-1 && dbg_charCodeAt(this.m_script,t_findIndex+1)==47){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<505>";
								t_findHasClose=true;
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<506>";
								t_findTagStartSize=2;
							}else{
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<508>";
								t_findTagStartSize=1;
							}
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<510>";
							t_findHasStart=true;
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<511>";
							t_findTagStart=t_findIndex;
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<512>";
							t_findTagLine=t_findLine;
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<513>";
							t_findTagColumn=t_findIndex-t_findLineStart+1;
						}
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<516>";
						t_findWhitespace=t_findWhitespace+String.fromCharCode(dbg_charCodeAt(this.m_script,t_findIndex));
					}
				}else{
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<520>";
					if(dbg_charCodeAt(this.m_script,t_findIndex)==45 && t_findIndex+3<t_scriptLength && this.m_script.slice(t_findIndex,t_findIndex+3)=="-->"){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<521>";
						t_findHasComment=false;
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<522>";
						t_findIndex+=2;
					}
				}
			}else{
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<527>";
				if(t_findHasQuotes==false){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<529>";
					if(dbg_charCodeAt(this.m_script,t_findIndex)==34){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<531>";
						t_findHasQuotes=true;
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<532>";
						t_findQuoteCharacter=34;
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<533>";
						if(dbg_charCodeAt(this.m_script,t_findIndex)==39){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<535>";
							t_findHasQuotes=true;
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<536>";
							t_findQuoteCharacter=39;
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<537>";
							if(dbg_charCodeAt(this.m_script,t_findIndex)==60){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<539>";
								var t_=this.p_SetError("unexpected opening bracket",t_findLine,t_findIndex-t_findLineStart+1,"");
								pop_err();
								return t_;
							}else{
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<540>";
								if(dbg_charCodeAt(this.m_script,t_findIndex)==62){
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<542>";
									if(t_findIndex>0 && dbg_charCodeAt(this.m_script,t_findIndex-1)==47){
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<543>";
										t_findTagEndSize=2;
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<544>";
										t_findHasClose=true;
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<545>";
										t_findTagEnd=t_findIndex-1;
									}else{
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<547>";
										t_findHasPair=true;
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<548>";
										t_findTagEndSize=1;
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<549>";
										t_findTagEnd=t_findIndex;
									}
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<551>";
									t_findHasEnd=true;
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<552>";
									break;
								}
							}
						}
					}
				}else{
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<556>";
					if(dbg_charCodeAt(this.m_script,t_findIndex)==t_findQuoteCharacter){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<556>";
						t_findHasQuotes=false;
					}
				}
			}
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<562>";
		if(t_findHasQuotes){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<562>";
			var t_2=this.p_SetError("expecting ending quote",t_findLine,t_scriptLength-t_findLineStart,"");
			pop_err();
			return t_2;
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<563>";
		if(t_findHasStart && t_findHasEnd==false){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<563>";
			var t_3=this.p_SetError("expecting ending bracket",t_findLine,t_scriptLength-t_findLineStart,"");
			pop_err();
			return t_3;
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<566>";
		if(t_findHasEnd==false){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<569>";
			if(t_stack.p_Count()>1){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<569>";
				var t_4=this.p_SetError("unexpected end of file",t_findLine,t_scriptLength-t_findLineStart,"");
				pop_err();
				return t_4;
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<574>";
			break;
		}else{
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<577>";
			t_findName="";
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<578>";
			t_findOperator="";
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<579>";
			t_findSegment="";
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<580>";
			t_findHasEnd=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<581>";
			t_findHasName=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<582>";
			t_findHasNameEnd=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<583>";
			t_findHasEquals=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<584>";
			t_findHasValue=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<585>";
			t_findHasQuotes=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<586>";
			t_findHasSegment=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<587>";
			t_findHasSegmentEnd=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<588>";
			t_findHasOperator=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<591>";
			t_stackTag=t_stack.p_Last();
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<592>";
			dbg_object(t_stackTag).m_value=dbg_object(t_stackTag).m_value+t_findWhitespace;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<595>";
			t_scriptIndex=t_findTagEnd+t_findTagEndSize;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<598>";
			t_findTag=c_ConfigNode.m_new2.call(new c_ConfigNode);
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<599>";
			dbg_object(t_findTag).m_line=t_findTagLine;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<600>";
			dbg_object(t_findTag).m_column=t_findTagColumn;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<602>";
			for(var t_findIndex2=t_findTagStart+t_findTagStartSize;t_findIndex2<t_findTagEnd;t_findIndex2=t_findIndex2+1){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<603>";
				if(t_findHasName==false){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<605>";
					if(dbg_charCodeAt(this.m_script,t_findIndex2)==32){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<607>";
						if((t_findName).length!=0){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<607>";
							t_findHasNameEnd=true;
						}
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<609>";
						if(dbg_charCodeAt(this.m_script,t_findIndex2)==10){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<611>";
							if((t_findName).length!=0){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<611>";
								t_findHasNameEnd=true;
							}
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<612>";
							t_findLine+=1;
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<613>";
							t_findLineStart=t_findIndex2+1;
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<615>";
							if(dbg_charCodeAt(this.m_script,t_findIndex2)==61){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<617>";
								if((t_findName).length!=0){
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<618>";
									t_findIndex2-=1;
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<619>";
									t_findHasNameEnd=true;
								}else{
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<621>";
									var t_5=this.p_SetError("expecting tag or attribute name",t_findLine,t_findIndex2-t_findLineStart+1,"");
									pop_err();
									return t_5;
								}
							}else{
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<624>";
								if(dbg_charCodeAt(this.m_script,t_findIndex2)==95 || dbg_charCodeAt(this.m_script,t_findIndex2)>=48 && dbg_charCodeAt(this.m_script,t_findIndex2)<=57 || dbg_charCodeAt(this.m_script,t_findIndex2)>=65 && dbg_charCodeAt(this.m_script,t_findIndex2)<=90 || dbg_charCodeAt(this.m_script,t_findIndex2)>=97 && dbg_charCodeAt(this.m_script,t_findIndex2)<=122){
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<626>";
									t_findName=t_findName+String.fromCharCode(dbg_charCodeAt(this.m_script,t_findIndex2));
								}else{
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<630>";
									var t_6=this.p_SetError("illegal character asc='"+String(dbg_charCodeAt(this.m_script,t_findIndex2))+"' chr='"+this.m_script.slice(t_findIndex2,t_findIndex2+1)+"'",t_findLine,t_findIndex2-t_findLineStart+1,"");
									pop_err();
									return t_6;
								}
							}
						}
					}
				}else{
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<635>";
					if(t_findHasEquals==false){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<637>";
						if(dbg_charCodeAt(this.m_script,t_findIndex2)==32){
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<640>";
							if(dbg_charCodeAt(this.m_script,t_findIndex2)==10){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<642>";
								t_findLine+=1;
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<643>";
								t_findLineStart=t_findIndex2+1;
							}else{
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<645>";
								if(dbg_charCodeAt(this.m_script,t_findIndex2)==61){
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<647>";
									t_findHasEquals=true;
								}else{
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<649>";
									if(dbg_charCodeAt(this.m_script,t_findIndex2)==95 || dbg_charCodeAt(this.m_script,t_findIndex2)>=48 && dbg_charCodeAt(this.m_script,t_findIndex2)<=57 || dbg_charCodeAt(this.m_script,t_findIndex2)>=65 && dbg_charCodeAt(this.m_script,t_findIndex2)<=90 || dbg_charCodeAt(this.m_script,t_findIndex2)>=97 && dbg_charCodeAt(this.m_script,t_findIndex2)<=122){
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<652>";
										t_findHasEnd=true;
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<653>";
										t_findIndex2-=1;
									}else{
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<657>";
										var t_7=this.p_SetError("illegal character asc='"+String(dbg_charCodeAt(this.m_script,t_findIndex2))+"' chr='"+this.m_script.slice(t_findIndex2,t_findIndex2+1)+"'",t_findLine,t_findIndex2-t_findLineStart+1,"");
										pop_err();
										return t_7;
									}
								}
							}
						}
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<662>";
						if(t_findHasQuotes==false){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<664>";
							if(t_findHasSegment==false){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<666>";
								if(dbg_charCodeAt(this.m_script,t_findIndex2)==32){
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<668>";
									if((t_findSegment).length!=0){
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<669>";
										t_findHasSegment=true;
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<670>";
										t_findHasSegmentEnd=true;
									}
								}else{
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<673>";
									if(dbg_charCodeAt(this.m_script,t_findIndex2)==10){
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<675>";
										if((t_findSegment).length!=0){
											err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<676>";
											t_findHasSegment=true;
											err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<677>";
											t_findHasSegmentEnd=true;
										}
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<680>";
										t_findLine+=1;
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<681>";
										t_findLineStart=t_findIndex2+1;
									}else{
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<683>";
										if(dbg_charCodeAt(this.m_script,t_findIndex2)==34 || dbg_charCodeAt(this.m_script,t_findIndex2)==39){
											err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<686>";
											if((t_findSegment).length!=0){
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<688>";
												var t_8=this.p_SetError("unexpected opening quote",t_findLine,t_findIndex2-t_findLineStart+1,"");
												pop_err();
												return t_8;
											}else{
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<691>";
												t_findHasQuotes=true;
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<692>";
												t_findHasValue=true;
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<693>";
												t_findQuoteCharacter=dbg_charCodeAt(this.m_script,t_findIndex2);
											}
										}else{
											err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<696>";
											if(dbg_charCodeAt(this.m_script,t_findIndex2)==45){
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<699>";
												if((t_findSegment).length!=0){
													err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<701>";
													t_findHasSegment=true;
													err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<702>";
													t_findHasSegmentEnd=true;
													err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<703>";
													t_findHasOperator=true;
													err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<704>";
													t_findOperator=String.fromCharCode(dbg_charCodeAt(this.m_script,t_findIndex2));
												}else{
													err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<707>";
													t_findSegment=t_findSegment+String.fromCharCode(dbg_charCodeAt(this.m_script,t_findIndex2));
													err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<708>";
													t_findHasValue=true;
												}
											}else{
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<711>";
												if(dbg_charCodeAt(this.m_script,t_findIndex2)==42 || dbg_charCodeAt(this.m_script,t_findIndex2)==43 || dbg_charCodeAt(this.m_script,t_findIndex2)==47){
													err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<714>";
													if(t_findHasValue==false){
														err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<716>";
														var t_9=this.p_SetError("unexpected operator asc='"+String(dbg_charCodeAt(this.m_script,t_findIndex2))+"' chr='"+this.m_script.slice(t_findIndex2,t_findIndex2+1)+"'",t_findLine,t_findIndex2-t_findLineStart+1,"");
														pop_err();
														return t_9;
													}else{
														err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<719>";
														t_findHasSegmentEnd=true;
														err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<720>";
														t_findHasOperator=true;
														err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<721>";
														t_findOperator=String.fromCharCode(dbg_charCodeAt(this.m_script,t_findIndex2));
													}
												}else{
													err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<724>";
													if(dbg_charCodeAt(this.m_script,t_findIndex2)==36 || dbg_charCodeAt(this.m_script,t_findIndex2)==46 || dbg_charCodeAt(this.m_script,t_findIndex2)==95 || dbg_charCodeAt(this.m_script,t_findIndex2)>=48 && dbg_charCodeAt(this.m_script,t_findIndex2)<=57 || dbg_charCodeAt(this.m_script,t_findIndex2)>=65 && dbg_charCodeAt(this.m_script,t_findIndex2)<=90 || dbg_charCodeAt(this.m_script,t_findIndex2)>=97 && dbg_charCodeAt(this.m_script,t_findIndex2)<=122){
														err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<727>";
														t_findSegment=t_findSegment+String.fromCharCode(dbg_charCodeAt(this.m_script,t_findIndex2));
														err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<728>";
														t_findHasValue=true;
													}else{
														err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<732>";
														var t_10=this.p_SetError("illegal character asc='"+String(dbg_charCodeAt(this.m_script,t_findIndex2))+"' chr='"+this.m_script.slice(t_findIndex2,t_findIndex2+1)+"'",t_findLine,t_findIndex2-t_findLineStart+1,"");
														pop_err();
														return t_10;
													}
												}
											}
										}
									}
								}
							}else{
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<737>";
								if(dbg_charCodeAt(this.m_script,t_findIndex2)==32){
								}else{
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<740>";
									if(dbg_charCodeAt(this.m_script,t_findIndex2)==10){
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<742>";
										t_findLine+=1;
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<743>";
										t_findLineStart=t_findIndex2+1;
									}else{
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<745>";
										if(dbg_charCodeAt(this.m_script,t_findIndex2)==95 || dbg_charCodeAt(this.m_script,t_findIndex2)>=48 && dbg_charCodeAt(this.m_script,t_findIndex2)<=57 || dbg_charCodeAt(this.m_script,t_findIndex2)>=65 && dbg_charCodeAt(this.m_script,t_findIndex2)<=90 || dbg_charCodeAt(this.m_script,t_findIndex2)>=97 && dbg_charCodeAt(this.m_script,t_findIndex2)<=122){
											err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<748>";
											t_findHasSegment=false;
											err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<749>";
											t_findIndex2-=1;
											err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<750>";
											t_findHasEnd=true;
										}else{
											err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<752>";
											if(dbg_charCodeAt(this.m_script,t_findIndex2)==42 || dbg_charCodeAt(this.m_script,t_findIndex2)==43 || dbg_charCodeAt(this.m_script,t_findIndex2)==45 || dbg_charCodeAt(this.m_script,t_findIndex2)==47){
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<755>";
												t_findHasSegment=false;
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<756>";
												t_findHasOperator=true;
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<757>";
												t_findOperator=String.fromCharCode(dbg_charCodeAt(this.m_script,t_findIndex2));
											}else{
												err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<760>";
												var t_11=this.p_SetError("illegal character asc='"+String(dbg_charCodeAt(this.m_script,t_findIndex2))+"' chr='"+this.m_script.slice(t_findIndex2,t_findIndex2+1)+"'",t_findLine,t_findIndex2-t_findLineStart+1,"");
												pop_err();
												return t_11;
											}
										}
									}
								}
							}
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<765>";
							if(dbg_charCodeAt(this.m_script,t_findIndex2)==10){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<767>";
								t_findLine+=1;
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<768>";
								t_findLineStart=t_findIndex2+1;
							}else{
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<770>";
								if(dbg_charCodeAt(this.m_script,t_findIndex2)==t_findQuoteCharacter){
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<772>";
									t_findHasSegment=true;
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<773>";
									t_findHasSegmentEnd=true;
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<774>";
									t_findHasQuotes=false;
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<775>";
									t_findQuoteCharacter=0;
								}else{
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<778>";
									t_findSegment=t_findSegment+String.fromCharCode(dbg_charCodeAt(this.m_script,t_findIndex2));
								}
							}
						}
					}
				}
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<786>";
				if(t_findIndex2==t_findTagEnd-1){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<787>";
					t_findHasEnd=true;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<789>";
					if(t_findHasQuotes){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<791>";
						var t_12=this.p_SetError("exepcting closing quote",t_findLine,t_findIndex2-t_findLineStart+1,"");
						pop_err();
						return t_12;
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<793>";
						if(t_findHasName==false){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<794>";
							if((t_findName).length!=0){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<794>";
								t_findHasNameEnd=true;
							}
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<796>";
							if(t_findHasEquals==true){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<797>";
								if(t_findHasValue==false && t_findSegment==""){
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<799>";
									var t_13=this.p_SetError("expecting attribute value",t_findLine,t_findIndex2-t_findLineStart+1,"");
									pop_err();
									return t_13;
								}else{
									err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<801>";
									if(t_findHasOperator){
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<803>";
										var t_14=this.p_SetError("unexcpected end of attribute",t_findLine,t_findIndex2-t_findLineStart+1,"");
										pop_err();
										return t_14;
									}else{
										err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<805>";
										if(t_findSegment!=""){
											err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<805>";
											t_findHasSegmentEnd=true;
										}
									}
								}
							}
						}
					}
				}
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<814>";
				if(t_findHasNameEnd){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<816>";
					if(t_findHasFirst==false){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<817>";
						t_findHasFirst=true;
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<818>";
						dbg_object(t_findTag).m_name=t_findName.toLowerCase();
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<820>";
						t_findHasStart=true;
					}
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<824>";
					t_findHasName=true;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<827>";
					t_findHasNameEnd=false;
				}
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<830>";
				if(t_findHasName){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<832>";
					if(t_findHasSegmentEnd==true){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<834>";
						t_findAttribute=t_findTag.p_GetConfigAttribute(t_findName);
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<835>";
						if(t_findAttribute==null){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<836>";
							t_findTag.p_SetAttribute(t_findName,t_findSegment);
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<838>";
							t_findAttribute.p_AddSegment(t_findSegment);
						}
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<842>";
						t_findHasSegmentEnd=false;
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<843>";
						t_findSegment="";
					}
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<847>";
					if(t_findHasOperator==true){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<849>";
						t_findAttribute=t_findTag.p_GetConfigAttribute(t_findName);
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<850>";
						if(t_findAttribute==null){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<851>";
							t_findTag.p_SetAttribute(t_findName,t_findOperator);
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<853>";
							t_findAttribute.p_AddSegment(t_findOperator);
						}
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<857>";
						t_findHasOperator=false;
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<858>";
						t_findOperator="";
					}
				}
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<862>";
				if(t_findHasEnd){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<864>";
					t_findName="";
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<865>";
					t_findOperator="";
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<866>";
					t_findSegment="";
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<867>";
					t_findHasEnd=false;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<868>";
					t_findHasName=false;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<869>";
					t_findHasNameEnd=false;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<870>";
					t_findHasEquals=false;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<871>";
					t_findHasValue=false;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<872>";
					t_findHasQuotes=false;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<873>";
					t_findHasSegment=false;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<874>";
					t_findHasSegmentEnd=false;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<875>";
					t_findHasOperator=false;
				}
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<880>";
			if(t_findHasClose){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<881>";
				if(t_findHasPair){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<883>";
					t_stackTag=t_stack.p_RemoveLast();
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<884>";
					if(t_stackTag!=null){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<885>";
						if(dbg_object(t_stackTag).m_name==dbg_object(t_findTag).m_name){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<887>";
							dbg_object(t_stackTag).m_parent.p_AddChild(t_stackTag);
						}else{
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<890>";
							var t_15=this.p_SetError("open tag name '"+dbg_object(t_stackTag).m_name+"' doesn't match closing tag name '"+dbg_object(t_findTag).m_name+"'",dbg_object(t_findTag).m_line,dbg_object(t_findTag).m_column,"");
							pop_err();
							return t_15;
						}
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<894>";
						var t_16=this.p_SetError("unexpected closing tag '"+dbg_object(t_findTag).m_name+"'",dbg_object(t_findTag).m_line,dbg_object(t_findTag).m_column,"");
						pop_err();
						return t_16;
					}
				}else{
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<898>";
					dbg_object(t_findTag).m_parent=t_stack.p_Last();
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<899>";
					dbg_object(t_findTag).m_parent.p_AddChild(t_findTag);
				}
			}else{
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<904>";
				dbg_object(t_findTag).m_parent=t_stack.p_Last();
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<905>";
				t_stack.p_AddLast2(t_findTag);
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<909>";
			t_findHasStart=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<910>";
			t_findHasClose=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<911>";
			t_findHasPair=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<912>";
			t_findHasFirst=false;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<913>";
			t_findWhitespace="";
		}
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<918>";
	pop_err();
	return true;
}
function c_List2(){
	Object.call(this);
	this.m__head=(c_HeadNode2.m_new.call(new c_HeadNode2));
}
c_List2.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List2.prototype.p_AddLast2=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<108>";
	var t_=c_Node5.m_new.call(new c_Node5,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List2.m_new2=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<14>";
		this.p_AddLast2(t_t);
	}
	pop_err();
	return this;
}
c_List2.prototype.p_Clear=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<36>";
	dbg_object(this.m__head).m__succ=this.m__head;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<37>";
	dbg_object(this.m__head).m__pred=this.m__head;
	pop_err();
	return 0;
}
c_List2.prototype.p_Count=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<41>";
	var t_n=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<41>";
	var t_node=dbg_object(this.m__head).m__succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<42>";
	while(t_node!=this.m__head){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<43>";
		t_node=dbg_object(t_node).m__succ;
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<44>";
		t_n+=1;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<46>";
	pop_err();
	return t_n;
}
c_List2.prototype.p_IsEmpty=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<50>";
	var t_=dbg_object(this.m__head).m__succ==this.m__head;
	pop_err();
	return t_;
}
c_List2.prototype.p_Last=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<80>";
	if(this.p_IsEmpty()){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<80>";
		error("Illegal operation on empty list");
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<82>";
	pop_err();
	return dbg_object(dbg_object(this.m__head).m__pred).m__data;
}
c_List2.prototype.p_RemoveLast=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<96>";
	if(this.p_IsEmpty()){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<96>";
		error("Illegal operation on empty list");
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<98>";
	var t_data=dbg_object(dbg_object(this.m__head).m__pred).m__data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<99>";
	dbg_object(this.m__head).m__pred.p_Remove();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<100>";
	pop_err();
	return t_data;
}
c_List2.prototype.p_Equals2=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<28>";
	var t_=t_lhs==t_rhs;
	pop_err();
	return t_;
}
c_List2.prototype.p_FindLast=function(t_value,t_start){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<128>";
	while(t_start!=this.m__head){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<129>";
		if(this.p_Equals2(t_value,dbg_object(t_start).m__data)){
			err_info="C:/MonkeyX77a/modules/monkey/list.monkey<129>";
			pop_err();
			return t_start;
		}
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<130>";
		t_start=dbg_object(t_start).m__pred;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<132>";
	pop_err();
	return null;
}
c_List2.prototype.p_FindLast2=function(t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<124>";
	var t_=this.p_FindLast(t_value,dbg_object(this.m__head).m__pred);
	pop_err();
	return t_;
}
c_List2.prototype.p_RemoveLast2=function(t_value){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<146>";
	var t_node=this.p_FindLast2(t_value);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<147>";
	if((t_node)!=null){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<147>";
		t_node.p_Remove();
	}
	pop_err();
}
c_List2.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<186>";
	var t_=c_Enumerator3.m_new.call(new c_Enumerator3,this);
	pop_err();
	return t_;
}
function c_Node5(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node5.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<261>";
	this.m__succ=t_succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<262>";
	this.m__pred=t_pred;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<263>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<264>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<265>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node5.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<258>";
	pop_err();
	return this;
}
c_Node5.prototype.p_Remove=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<274>";
	if(dbg_object(this.m__succ).m__pred!=this){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<274>";
		error("Illegal operation on removed node");
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<276>";
	dbg_object(this.m__succ).m__pred=this.m__pred;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<277>";
	dbg_object(this.m__pred).m__succ=this.m__succ;
	pop_err();
	return 0;
}
function c_HeadNode2(){
	c_Node5.call(this);
}
c_HeadNode2.prototype=extend_class(c_Node5);
c_HeadNode2.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<310>";
	c_Node5.m_new2.call(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<311>";
	this.m__succ=(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<312>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_ConfigAttribute(){
	Object.call(this);
	this.m_name="";
	this.m_segments=[];
	this.m_value="";
}
c_ConfigAttribute.prototype.p_UpdateValue=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<302>";
	var t_length=this.m_segments.length;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<304>";
	if(t_length==0){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<305>";
		this.m_value="";
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<306>";
		pop_err();
		return 0;
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<309>";
	if(t_length==1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<310>";
		this.m_value=dbg_array(this.m_segments,0)[dbg_index];
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<311>";
		pop_err();
		return 0;
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<314>";
	var t_build="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<315>";
	this.m_value="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<316>";
	for(var t_index=0;t_index<t_length;t_index=t_index+1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<317>";
		this.m_value=this.m_value+dbg_array(this.m_segments,t_index)[dbg_index];
	}
	pop_err();
	return 0;
}
c_ConfigAttribute.prototype.p_SetValue=function(t_value){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<339>";
	this.m_segments=[t_value];
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<340>";
	this.p_UpdateValue();
	pop_err();
	return 0;
}
c_ConfigAttribute.prototype.p_SetName=function(t_name){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<327>";
	dbg_object(this).m_name=t_name;
	pop_err();
	return 0;
}
c_ConfigAttribute.m_new=function(t_name,t_value){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<289>";
	this.p_SetName(t_name.toLowerCase());
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<290>";
	this.p_SetValue(t_value);
	pop_err();
	return this;
}
c_ConfigAttribute.m_new2=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<282>";
	pop_err();
	return this;
}
c_ConfigAttribute.prototype.p_AddSegment=function(t_segment){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<344>";
	var t_index=this.m_segments.length;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<345>";
	this.m_segments=resize_string_array(this.m_segments,t_index+1);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<346>";
	dbg_array(this.m_segments,t_index)[dbg_index]=t_segment
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<347>";
	this.p_UpdateValue();
	pop_err();
	return 0;
}
function c_ConfigError(){
	Object.call(this);
	this.m_message="";
	this.m_context="";
	this.m_data="";
	this.m_line=0;
	this.m_column=0;
}
c_ConfigError.m_new=function(t_message,t_context,t_data,t_line,t_column){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<17>";
	dbg_object(this).m_message=t_message;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<18>";
	dbg_object(this).m_context=t_context;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<19>";
	dbg_object(this).m_data=t_data;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<20>";
	dbg_object(this).m_line=t_line;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<21>";
	dbg_object(this).m_column=t_column;
	pop_err();
	return this;
}
c_ConfigError.m_new2=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<9>";
	pop_err();
	return this;
}
function c_List3(){
	Object.call(this);
	this.m__head=(c_HeadNode3.m_new.call(new c_HeadNode3));
}
c_List3.prototype.p_Clear=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<36>";
	dbg_object(this.m__head).m__succ=this.m__head;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<37>";
	dbg_object(this.m__head).m__pred=this.m__head;
	pop_err();
	return 0;
}
c_List3.prototype.p_ObjectEnumerator=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<186>";
	var t_=c_Enumerator2.m_new.call(new c_Enumerator2,this);
	pop_err();
	return t_;
}
c_List3.m_new=function(){
	push_err();
	pop_err();
	return this;
}
c_List3.prototype.p_AddLast3=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<108>";
	var t_=c_Node6.m_new.call(new c_Node6,this.m__head,dbg_object(this.m__head).m__pred,t_data);
	pop_err();
	return t_;
}
c_List3.m_new2=function(t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_=t_data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	var t_2=0;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
	while(t_2<t_.length){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		var t_t=dbg_array(t_,t_2)[dbg_index];
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<13>";
		t_2=t_2+1;
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<14>";
		this.p_AddLast3(t_t);
	}
	pop_err();
	return this;
}
function c_Node6(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node6.m_new=function(t_succ,t_pred,t_data){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<261>";
	this.m__succ=t_succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<262>";
	this.m__pred=t_pred;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<263>";
	dbg_object(this.m__succ).m__pred=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<264>";
	dbg_object(this.m__pred).m__succ=this;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<265>";
	this.m__data=t_data;
	pop_err();
	return this;
}
c_Node6.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<258>";
	pop_err();
	return this;
}
function c_HeadNode3(){
	c_Node6.call(this);
}
c_HeadNode3.prototype=extend_class(c_Node6);
c_HeadNode3.m_new=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<310>";
	c_Node6.m_new2.call(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<311>";
	this.m__succ=(this);
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<312>";
	this.m__pred=(this);
	pop_err();
	return this;
}
function c_Enumerator2(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator2.m_new=function(t_list){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<326>";
	this.m__list=t_list;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<327>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator2.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<323>";
	pop_err();
	return this;
}
c_Enumerator2.prototype.p_HasNext=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<331>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<332>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<334>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator2.prototype.p_NextObject=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<338>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<339>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<340>";
	pop_err();
	return t_data;
}
function bb_config_LoadConfig(t_script){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<948>";
	var t_config=c_Config.m_new.call(new c_Config);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<949>";
	dbg_object(t_config).m_path="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<952>";
	t_config.p_Parse(t_script);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/config.monkey<953>";
	pop_err();
	return t_config;
}
function c_Enumerator3(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator3.m_new=function(t_list){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<326>";
	this.m__list=t_list;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<327>";
	this.m__curr=dbg_object(dbg_object(t_list).m__head).m__succ;
	pop_err();
	return this;
}
c_Enumerator3.m_new2=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<323>";
	pop_err();
	return this;
}
c_Enumerator3.prototype.p_HasNext=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<331>";
	while(dbg_object(dbg_object(this.m__curr).m__succ).m__pred!=this.m__curr){
		err_info="C:/MonkeyX77a/modules/monkey/list.monkey<332>";
		this.m__curr=dbg_object(this.m__curr).m__succ;
	}
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<334>";
	var t_=this.m__curr!=dbg_object(this.m__list).m__head;
	pop_err();
	return t_;
}
c_Enumerator3.prototype.p_NextObject=function(){
	push_err();
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<338>";
	var t_data=dbg_object(this.m__curr).m__data;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<339>";
	this.m__curr=dbg_object(this.m__curr).m__succ;
	err_info="C:/MonkeyX77a/modules/monkey/list.monkey<340>";
	pop_err();
	return t_data;
}
function c_SimpleInput(){
	Object.call(this);
	this.m_text="";
	this.m_x=0;
	this.m_y=0;
	this.m_font=null;
	this.m_height=0;
	this.m_heightOffset=0;
	this.m_cursorPos=0;
}
c_SimpleInput.m_new=function(t_txt,t_x,t_y){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<27>";
	dbg_object(this).m_text=t_txt;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<28>";
	dbg_object(this).m_x=t_x;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<29>";
	dbg_object(this).m_y=t_y;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<30>";
	dbg_object(this).m_font=c_AngelFont.m_GetCurrent();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<31>";
	dbg_object(this).m_height=dbg_object(dbg_object(this).m_font).m_height;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<32>";
	dbg_object(this).m_heightOffset=dbg_object(dbg_object(this).m_font).m_heightOffset;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<33>";
	dbg_object(this).m_cursorPos=t_txt.length;
	pop_err();
	return this;
}
c_SimpleInput.m_new2=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<7>";
	pop_err();
	return this;
}
c_SimpleInput.m_count=0;
c_SimpleInput.prototype.p_Update=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<46>";
	c_SimpleInput.m_count=(c_SimpleInput.m_count+1) % 7;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<47>";
	do{
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<48>";
		var t_asc=bb_input_GetChar();
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<49>";
		if(!((t_asc)!=0)){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<49>";
			break;
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<50>";
		if(t_asc>31 && t_asc<127 || t_asc>127 && t_asc<255){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<51>";
			this.m_text=this.m_text.slice(0,this.m_cursorPos)+String.fromCharCode(t_asc)+this.m_text.slice(this.m_cursorPos);
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<53>";
			this.m_cursorPos+=1;
		}else{
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<55>";
			var t_1=t_asc;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<56>";
			if(t_1==8){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<57>";
				if(this.m_cursorPos>0){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<59>";
					this.m_text=this.m_text.slice(0,this.m_cursorPos-1)+this.m_text.slice(this.m_cursorPos);
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<60>";
					this.m_cursorPos-=1;
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<61>";
					break;
				}
			}else{
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<63>";
				if(t_1==13){
				}else{
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<66>";
					if(t_1==65573){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<67>";
						this.m_cursorPos-=1;
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<68>";
						if(this.m_cursorPos<0){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<68>";
							this.m_cursorPos=0;
						}
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<69>";
						break;
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<71>";
						if(t_1==65575){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<72>";
							this.m_cursorPos+=1;
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<73>";
							if(this.m_cursorPos>this.m_text.length){
								err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<73>";
								this.m_cursorPos=this.m_text.length;
							}
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<74>";
							break;
						}
					}
				}
			}
		}
	}while(!(false));
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<79>";
	pop_err();
	return this.m_text;
}
c_SimpleInput.prototype.p_Draw2=function(t_x,t_y){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<41>";
	this.m_font.p_DrawText(this.m_text,t_x,t_y);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<42>";
	if(c_SimpleInput.m_count>3){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<42>";
		bb_graphics_DrawRect((t_x+this.m_font.p_TextWidth(this.m_text.slice(0,this.m_cursorPos))),(t_y+this.m_heightOffset),2.0,(this.m_height));
	}
	pop_err();
}
c_SimpleInput.prototype.p_Draw3=function(){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpleinput.monkey<37>";
	this.p_Draw2(this.m_x,this.m_y);
	pop_err();
}
function bb_input_GetChar(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/input.monkey<44>";
	var t_=bb_input_device.p_GetChar();
	pop_err();
	return t_;
}
function bb_graphics_DebugRenderDevice(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<49>";
	if(!((bb_graphics_renderDevice)!=null)){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<49>";
		error("Rendering operations can only be performed inside OnRender");
	}
	pop_err();
	return 0;
}
function bb_graphics_Cls(t_r,t_g,t_b){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<376>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<378>";
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_DrawImageRect(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_frame){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<495>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<496>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<496>";
		error("Invalid image frame");
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<497>";
	if(t_srcX<0 || t_srcY<0 || t_srcX+t_srcWidth>dbg_object(t_image).m_width || t_srcY+t_srcHeight>dbg_object(t_image).m_height){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<497>";
		error("Invalid image rectangle");
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<500>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<502>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<504>";
	bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,-dbg_object(t_image).m_tx+t_x,-dbg_object(t_image).m_ty+t_y,t_srcX+dbg_object(t_f).m_x,t_srcY+dbg_object(t_f).m_y,t_srcWidth,t_srcHeight);
	pop_err();
	return 0;
}
function bb_graphics_PushMatrix(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<332>";
	var t_sp=dbg_object(bb_graphics_context).m_matrixSp;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<333>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+0)[dbg_index]=dbg_object(bb_graphics_context).m_ix
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<334>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+1)[dbg_index]=dbg_object(bb_graphics_context).m_iy
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<335>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+2)[dbg_index]=dbg_object(bb_graphics_context).m_jx
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<336>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+3)[dbg_index]=dbg_object(bb_graphics_context).m_jy
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<337>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+4)[dbg_index]=dbg_object(bb_graphics_context).m_tx
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<338>";
	dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+5)[dbg_index]=dbg_object(bb_graphics_context).m_ty
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<339>";
	dbg_object(bb_graphics_context).m_matrixSp=t_sp+6;
	pop_err();
	return 0;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<353>";
	var t_ix2=t_ix*dbg_object(bb_graphics_context).m_ix+t_iy*dbg_object(bb_graphics_context).m_jx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<354>";
	var t_iy2=t_ix*dbg_object(bb_graphics_context).m_iy+t_iy*dbg_object(bb_graphics_context).m_jy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<355>";
	var t_jx2=t_jx*dbg_object(bb_graphics_context).m_ix+t_jy*dbg_object(bb_graphics_context).m_jx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<356>";
	var t_jy2=t_jx*dbg_object(bb_graphics_context).m_iy+t_jy*dbg_object(bb_graphics_context).m_jy;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<357>";
	var t_tx2=t_tx*dbg_object(bb_graphics_context).m_ix+t_ty*dbg_object(bb_graphics_context).m_jx+dbg_object(bb_graphics_context).m_tx;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<358>";
	var t_ty2=t_tx*dbg_object(bb_graphics_context).m_iy+t_ty*dbg_object(bb_graphics_context).m_jy+dbg_object(bb_graphics_context).m_ty;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<359>";
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	pop_err();
	return 0;
}
function bb_graphics_Transform2(t_m){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<349>";
	bb_graphics_Transform(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<363>";
	bb_graphics_Transform(1.0,0.0,0.0,1.0,t_x,t_y);
	pop_err();
	return 0;
}
function bb_graphics_Rotate(t_angle){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<371>";
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<367>";
	bb_graphics_Transform(t_x,0.0,0.0,t_y,0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_PopMatrix(){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<343>";
	var t_sp=dbg_object(bb_graphics_context).m_matrixSp-6;
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<344>";
	bb_graphics_SetMatrix(dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+0)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+1)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+2)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+3)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+4)[dbg_index],dbg_array(dbg_object(bb_graphics_context).m_matrixStack,t_sp+5)[dbg_index]);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<345>";
	dbg_object(bb_graphics_context).m_matrixSp=t_sp;
	pop_err();
	return 0;
}
function bb_graphics_DrawImageRect2(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_rotation,t_scaleX,t_scaleY,t_frame){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<510>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<511>";
	if(t_frame<0 || t_frame>=dbg_object(t_image).m_frames.length){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<511>";
		error("Invalid image frame");
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<512>";
	if(t_srcX<0 || t_srcY<0 || t_srcX+t_srcWidth>dbg_object(t_image).m_width || t_srcY+t_srcHeight>dbg_object(t_image).m_height){
		err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<512>";
		error("Invalid image rectangle");
	}
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<515>";
	var t_f=dbg_array(dbg_object(t_image).m_frames,t_frame)[dbg_index];
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<517>";
	bb_graphics_PushMatrix();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<519>";
	bb_graphics_Translate(t_x,t_y);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<520>";
	bb_graphics_Rotate(t_rotation);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<521>";
	bb_graphics_Scale(t_scaleX,t_scaleY);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<522>";
	bb_graphics_Translate(-dbg_object(t_image).m_tx,-dbg_object(t_image).m_ty);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<524>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<526>";
	bb_graphics_renderDevice.DrawSurface2(dbg_object(t_image).m_surface,0.0,0.0,t_srcX+dbg_object(t_f).m_x,t_srcY+dbg_object(t_f).m_y,t_srcWidth,t_srcHeight);
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<528>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_graphics_DrawRect(t_x,t_y,t_w,t_h){
	push_err();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<391>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<393>";
	bb_graphics_context.p_Validate();
	err_info="C:/MonkeyX77a/modules/mojo/graphics.monkey<394>";
	bb_graphics_renderDevice.DrawRect(t_x,t_y,t_w,t_h);
	pop_err();
	return 0;
}
function c_SimpleTextBox(){
	Object.call(this);
}
c_SimpleTextBox.m_font=null;
c_SimpleTextBox.m_align=0;
c_SimpleTextBox.m_yOffset=0;
c_SimpleTextBox.m_lineGap=0;
c_SimpleTextBox.m_DrawTextLineHTML=function(t_txt,t_x,t_y){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<158>";
	c_SimpleTextBox.m_font.p_DrawHTML2(t_txt,t_x,t_y,c_SimpleTextBox.m_align);
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<159>";
	c_SimpleTextBox.m_yOffset+=c_SimpleTextBox.m_lineGap+dbg_object(c_SimpleTextBox.m_font).m_height;
	pop_err();
}
c_SimpleTextBox.m_DrawHTML=function(t_text,t_x,t_y,t_width,t_alignment){
	push_err();
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<80>";
	var t_thisLine="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<81>";
	var t_charOffset=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<83>";
	var t_wordLen=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<84>";
	var t_word="";
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<86>";
	c_SimpleTextBox.m_font=c_AngelFont.m_current;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<87>";
	c_SimpleTextBox.m_align=t_alignment;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<89>";
	c_SimpleTextBox.m_yOffset=0;
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<90>";
	for(var t_i=0;t_i<t_text.length;t_i=t_i+1){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<91>";
		if(t_y+c_SimpleTextBox.m_yOffset>bb_graphics_DeviceHeight()){
			pop_err();
			return;
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<95>";
		var t_asc=dbg_charCodeAt(t_text,t_i);
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<96>";
		var t_2=t_asc;
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<97>";
		if(t_2==32){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<98>";
			t_wordLen=c_SimpleTextBox.m_font.p_TextWidth(c_AngelFont.m_StripHTML(t_word));
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<99>";
			if(t_charOffset+t_wordLen>t_width){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<100>";
				c_SimpleTextBox.m_DrawTextLineHTML(t_thisLine,t_x,t_y+c_SimpleTextBox.m_yOffset);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<101>";
				t_thisLine="";
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<102>";
				t_charOffset=0;
			}
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<105>";
			t_charOffset+=t_wordLen+dbg_object(dbg_array(c_SimpleTextBox.m_font.p_GetChars(),32)[dbg_index]).m_xAdvance;
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<106>";
			t_thisLine=t_thisLine+(t_word+" ");
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<108>";
			t_word="";
		}else{
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<110>";
			if(t_2==10){
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<111>";
				t_wordLen=c_SimpleTextBox.m_font.p_TextWidth(c_AngelFont.m_StripHTML(t_word));
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<112>";
				if(t_charOffset+t_wordLen>t_width){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<113>";
					c_SimpleTextBox.m_DrawTextLineHTML(t_thisLine,t_x,t_y+c_SimpleTextBox.m_yOffset);
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<114>";
					t_thisLine="";
				}
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<116>";
				t_thisLine=t_thisLine+t_word;
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<118>";
				c_SimpleTextBox.m_DrawTextLineHTML(t_thisLine,t_x,t_y+c_SimpleTextBox.m_yOffset);
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<120>";
				t_thisLine="";
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<121>";
				t_charOffset=0;
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<122>";
				t_word="";
			}else{
				err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<123>";
				if(t_2==60){
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<124>";
					if(t_text.slice(t_i+1,t_i+3)=="i>" || t_text.slice(t_i+1,t_i+3)=="b>"){
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<125>";
						t_word=t_word+t_text.slice(t_i,t_i+3);
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<126>";
						t_i+=2;
					}else{
						err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<128>";
						if(t_text.slice(t_i+1,t_i+4)=="/i>" || t_text.slice(t_i+1,t_i+4)=="/b>"){
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<129>";
							t_word=t_word+t_text.slice(t_i,t_i+4);
							err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<130>";
							t_i+=3;
						}
					}
				}else{
					err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<135>";
					t_word=t_word+String.fromCharCode(t_asc);
				}
			}
		}
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<139>";
	if(t_word!=""){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<140>";
		t_wordLen=c_SimpleTextBox.m_font.p_TextWidth(c_AngelFont.m_StripHTML(t_word));
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<141>";
		if(t_charOffset+t_wordLen>t_width){
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<142>";
			c_SimpleTextBox.m_DrawTextLineHTML(t_thisLine,t_x,t_y+c_SimpleTextBox.m_yOffset);
			err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<143>";
			t_thisLine="";
		}
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<145>";
		t_thisLine=t_thisLine+t_word;
	}
	err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<147>";
	if(t_thisLine!=""){
		err_info="C:/Users/Rom/Dropbox/Programmes/angelfont_example/simpletextbox.monkey<148>";
		c_SimpleTextBox.m_DrawTextLineHTML(t_thisLine,t_x,t_y+c_SimpleTextBox.m_yOffset);
	}
	pop_err();
}
function bbInit(){
	bb_app__app=null;
	bb_app__delegate=null;
	bb_app__game=BBGame.Game();
	bb_angelfont_example_theApp=null;
	bb_graphics_device=null;
	bb_graphics_context=c_GraphicsContext.m_new.call(new c_GraphicsContext);
	c_Image.m_DefaultFlags=0;
	bb_audio_device=null;
	bb_input_device=null;
	bb_graphics_renderDevice=null;
	bb_app__updateRate=0;
	c_AngelFont.m_err="";
	c_AngelFont.m_current=null;
	c_AngelFont.m_firstKp=null;
	c_AngelFont.m__list=c_StringMap.m_new.call(new c_StringMap);
	c_SimpleInput.m_count=0;
	c_AngelFont.m_secondKp=null;
	c_SimpleTextBox.m_font=null;
	c_SimpleTextBox.m_align=0;
	c_SimpleTextBox.m_yOffset=0;
	c_SimpleTextBox.m_lineGap=5;
}
//${TRANSCODE_END}

'TEST CHANGEMENT GIT
Strict
Import mojo
Import angelfont
Import simpleinput
Import simpletextbox

Global theApp:MyApp
Global txtinformation:String 
Global numeroDuFond:Int
	
Function Main:Int ()
	theApp = New MyApp()
	
	Return 0
End Function

Class MyApp Extends App
	
	
	Field start:Bouton
	Field texte1:AngelFontExample
	
	Method OnCreate:Int()
		
		SetUpdateRate(60)
		
		'Bouton
		start = New Bouton
					
		'AngelFont
		texte1 = New AngelFontExample
		texte1.OnCreate()
		
		Return 0
	End Method
	
	
	Method OnUpdate:Int()
	
		start.OnUpdate()
		text1.OnUpdate()
		
		Return 0
	End Method
	

	Method OnRender:Int()
				
		start.OnRender()
		texte1.OnRender()
		
		Return 0
	End Method

	
	
End Class

Class AngelFontExample 

	Field font:AngelFont
	Field inp:SimpleInput
	Field textBoxText:String
	
	Method OnCreate:Int()
		SetUpdateRate 30
		
		EnableKeyboard
		
		font = New AngelFont()

		font.italicSkew = 0.15
		
		'font.LoadFont("angel3")			'deprecated
		'font.LoadFont("angel_verdana")		'deprecated		
		
'		font.LoadFontXml("angel_verdana")		' single font texture 'page'
		font.LoadFontXml("pagedfont")			' multiple font texture 'pages'
		
		
		inp = New SimpleInput("simple input")
		
'		textBoxText = LoadString("simpletextboxtext.txt")
		textBoxText = "You will notice you are unable to move. Your only ability is the ninjah rope for this level. At the bottom right of the screen you will see three ability icons. Move, lets you move left and right. Rope, lets you use your ninjah rope. Gun, lets you boost."
'		textBoxText = LoadString("simpletextboxhtml.txt")
		
	End Method
End Class

Class Bouton
	Field x:Int 'Emplacement selon x
	Field y:Int 'Emplacement selon y
	Field largeur:Int = 64'Largeur du bouton
	Field hauteur:Int = 32'Hauteur du bouton
	Field text:String = "Bouton"
	Field tmp:Bool
	Field bouton:Image
	
	Method OnCreate:Int()
		 bouton=LoadImage("bouton.png")
		'TEMPCOM bouton=LoadImage("anim1.png",64,64,2)
		Return 0
	End Method
	
	Method OnUpdate :Int()
		
		'On clic on the area
		Local hit:=KeyHit( KEY_LMB ) 'Uses KeyHit to check the left mouse button.
		
		If hit = true
			Print ("X =" + x + "Y=" + y)
		End
		
		If hit And MouseY()>y And MouseY()<(y+hauteur) And MouseX()>x And MouseX()<(x+largeur)
			Print "clic sur le bouton" + txtinformation
        	txtinformation = "clic sur le bouton"
        	
        	numeroDuFond = 1
        	
        	
        	Print("numeroDuFond = "+ numeroDuFond)
		End
        Return 0
	End Method
	
	Method OnRender :Int()
		
		'DrawRect x, y, largeur, hauteur
		DrawImage bouton,x+largeur/2,y+hauteur/2,0
		'DrawText text,x+largeur/2,y+hauteur/2,0.5,0.5
		Return 0
	End Method
End


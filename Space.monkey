Strict
Import mojo
Global theApp:MyApp
Global txtinformation:String 
Global numeroDuFond:Int
	
Function Main:Int ()
	theApp = New MyApp()
	Return 0
End Function


Class MyApp Extends App
	
	
	Field start:Bouton
	Field score:Affichage
	Field fond:Image
	Field fond1:Image
	Field fond2:Image
	Field information:Affichage
	
	Method OnCreate:Int()
		
		SetUpdateRate(60)
		
		'Bouton démarrer
		start = New Bouton
		start.x = 150
		start.y= 150
		start.OnCreate()
		
		'Affichage du SCORE
		score = New Affichage
		score.x = 300
		score.y = 300
		score.OnCreate()
		score.texte = "SCORE"
		score.infobulle = True
		
		'Affichage de l'infobulle
		information = New Affichage
		information.x=0
		information.y=0
		information.OnCreate()
		information.texte = txtinformation
		
		'Fond d'écran
		fond=LoadImage("galaxie.jpg")
		fond2=LoadImage("bureau.jpg")
		Return 0
	End Method
	
	
	Method OnUpdate:Int()
		start.OnUpdate()
		score.OnUpdate()
		information.texte = txtinformation
		information.OnUpdate()
		
		Return 0
	End Method
	

	Method OnRender:Int()
		
		Cls()
		If numeroDuFond = 1
			DrawImage fond,0,0,0
		End
		
		If numeroDuFond = 2
			DrawImage fond2,0,0,0
		End
		
		start.OnRender()
		score.OnRender()
		information.OnRender()
		
		Return 0
	End Method

	'summary: This method is called instead of OnRender when the application should render itself, but there are still resources such as images or sounds in the process of being loaded.
	Method OnLoading:Int()
		Return 0
	End Method
	
	'summary: This method is called when the application's device window size changes.
	Method OnResize:Int()
		Return 0
	End Method
	
	'#REGION Code to handle susped status of the game goes here
	
	'summary: OnSuspend is called when your application is about to be suspended.
	Method OnSuspend:Int()
		Return 0
	End Method
	
	'summary: OnResume is called when your application is made active again after having been in a suspended state.
	Method OnResume:Int()
		Return 0
	End Method
	
	'summary: This method is called when the application's 'close' button is pressed.
	Method OnClose:Int()
		Super.OnClose()
		Return 0
	End Method

	'summary:This method is called when the application's 'back' button is pressed.
	Method OnBack:Int()
		Super.OnBack()
		Return 0
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

Class Affichage
	Field x:Int 'Emplacement selon x
	Field y:Int 'Emplacement selon y
	Field largeur:Int = 64'Largeur du carré
	Field hauteur:Int = 32'Hauteur du carré
	Field texte:String = "Affichage"
	Field infobulle:Bool = False
	Field survol:Bool

	Method OnCreate :Int()
		Return 0
	End Method
	
	Method OnUpdate :Int()
		
		If infobulle		
		'The mouse is over the area
			If MouseY()>y And MouseY()<(y+hauteur) And MouseX()>x And MouseX()<(x+largeur) 
				txtinformation = "survol du score, afficher des infos"
				Print "survol"
				survol = True
				numeroDuFond = 2
			End
        End
        Return 0
	End Method
	
	Method OnRender :Int()
		
		SetColor ( 255, 255,0 )
		DrawRect x, y, largeur, hauteur
		DrawText texte,x+largeur/2,y+hauteur/2,0.5,0.5
		Return 0
	End Method
	
	
End Class

Class Ecran
	

	Method OnCreate :Int()
		Return 0
	End Method
	
	Method OnUpdate :Int()
		
	      Return 0
	End Method
	
	Method OnRender :Int()
		
		Return 0
	End Method
	
	
End Class


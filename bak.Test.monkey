Import mojo

Function Main ()
	Local start:Bouton = New Bouton
	start.x = 100
	
End

Class Bouton Extends App
	Field x:Int 'Emplacement selon x
	Field y:Int 'Emplacement selon y
	Field largeur:Int = 64'Largeur du bouton
	Field hauteur:Int = 32'Hauteur du bouton
	
	Method OnCreate ()
		SetUpdateRate 60
	End
	
	Method OnUpdate ()
				
		Local hit=KeyHit( KEY_LMB ) 'Uses KeyHit to check the left mouse button.  You could also use MouseHit( MOUSE_LEFT )
        If hit And MouseY()>y And MouseY()<(y+hauteur) And MouseX()>x And MouseX()<(x+largeur)
		Print "clic sur le bouton"
        
        End
        
	End
	
	Method OnRender ()
		Cls 64, 96, 128
		SetColor ( 255, 255,0 )
		DrawRect x, y, largeur, hauteur
	End
End

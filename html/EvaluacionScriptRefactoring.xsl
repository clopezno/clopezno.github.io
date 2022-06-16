<?xml version="1.0"?>


<html xsl:version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml">
   <body>
    <h1> Evaluacion practica R01. Refactoring Lab Session.</h1>
    <xsl:for-each select="session/refactoring">
	   <h3> <xsl:value-of select="@description"/> </h3>  
    </xsl:for-each>
  </body>
</html>
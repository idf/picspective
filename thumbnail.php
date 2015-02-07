<?php
$SIZE = 306*3;
$im = @imagecreate($SIZE, $SIZE)
    or die("Cannot Initialize new GD image stream");
$SIZE = 306;

$sources = array(
            'http://instagram.com/p/yt4-OAjMtR/media/?size=m',
            'http://instagram.com/p/v792rvjMpb/media/?size=m',
            'http://instagram.com/p/u-jP_sDMtf/media/?size=m',
            'http://instagram.com/p/uIrlapDMlc/media/?size=m',
            'http://instagram.com/p/rsoCDAjMtI/media/?size=m',
            'http://instagram.com/p/rsoCDAjMtI/media/?size=m',
            'http://instagram.com/p/oHnZqpjMjv/media/?size=m',
            'http://instagram.com/p/mZV42pjMva/media/?size=m',
            'http://instagram.com/p/mFBgLMDMuV/media/?size=m'
        );
for ($i=0;$i<sizeof($sources);$i++) {
	$newimg =  imagecreatefromjpeg($sources[$i]);
	imagealphablending($im, false);
	imagesavealpha($newimg, true);
	imagecopymerge($im, $newimg, floor($i/3)*$SIZE , ($i%3)*$SIZE , 0 , 0 , $SIZE , $SIZE , 1);
	imagedestroy($newimg);
}

sleep(10);
// imagecopymerge($dest, $src, 10, 9, 0, 0, 181, 180, 100); //have to play with these numbers for it to work for you, etc.
header("Content-Type: image/jpg");
imagejpeg($im);

imagedestroy($im);
?>
<?php 
    $a = new Memcached();
    $a->addServer('localhost', 11211);


    $test = $a->set('key', 'lester', 6000);


    $sample = $a->get('key');
    var_dump($sample);
?>
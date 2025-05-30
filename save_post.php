<?php
$data = json_decode(file_get_contents('php://input'), true);
$title = $data['title'];
$content = $data['content'];

if (!$title || !$content) {
    http_response_code(400);
    echo json_encode(["error" => "Missing title or content."]);
    exit;
}

$file = 'posts.json';
$posts = [];

if (file_exists($file)) {
    $posts = json_decode(file_get_contents($file), true);
}

$posts[] = ["title" => $title, "content" => $content];

file_put_contents($file, json_encode($posts, JSON_PRETTY_PRINT));
echo json_encode(["success" => true]);
?>

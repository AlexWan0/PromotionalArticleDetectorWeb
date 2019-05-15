var tokenizer = JSON.parse("{}");
var model = undefined;

async function init(){
	model = await tf.loadLayersModel('javascripts/model.json');

	$.getJSON("/javascripts/tokenized.json", function(json){
		console.log(json);

		//var sliced = JSON.parse("{}");

		for(var i = 0; i < 50000; i++)
			tokenizer[i] = json[i];

		//tokenizer = tokenizerFromJson(JSON.stringify(json));

		$("#start").text("Detect!");
		$("#start").removeAttr("disabled");
	});
}

function showLoading(callback){
	$("#start").hide();
	$("#result").hide();
	$("#loadingCircle").fadeIn(function(){
		callback();
	});
}

$(function(){
	$("#start").click(async function(){
		showLoading(function(){
			const input = $("#input").val();
			console.log(input);

			//console.log(input.split(" "));
			/*input.split(" ").forEach(function(word){
				const seedWordToken = getTokenisedWord(word);
				if(seedWordToken.dataSync()[0])
					word_tokens.push(seedWordToken);
			});*/

			var word_tokens = [];

			var word_raw = input.split(" ");

			for(var word in word_raw){
				console.log(word);
				var token = tokenizer[word];
				if(token){
					console.log(token);
					word_tokens.push(token);
				}
			}

			console.log("tl: "+word_tokens.length)
			var token_len = word_tokens.length;
			if(token_len < 400){
				for(var i = 0; i < (400 - token_len); i++){
					console.log(i);
					word_tokens.push(0);
				}
			}
			word_tokens = word_tokens.slice(0, 400);
			
			console.log(word_tokens)

			var token_ten = tf.tensor2d(word_tokens, [1, 400]);

			console.log(token_ten.shape)

			model.predict(token_ten).data().then(predictions => {
				const resultIdx = tf.argMax(predictions).dataSync()[0];
				console.log(predictions);
				//alert(predictions + " | " + resultIdx);

				var result_mapping = ["neutral", "promotional"];
			
				$("#loadingCircle").hide();
				$("#result").text(Math.round(predictions[resultIdx]*10000)/100 + "% chance this article is " + result_mapping[resultIdx]);				
				$("#start").css("margin-top", "10px");
				$("#result").show(800);
				$("#start").show();
			});

			console.log(model);
		});
	});
});

init();

//const prediction = model.predict(example);
class Tokenizer{
	constructor(num_words=50000, filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n', lower=true, split=' ', char_level=false, oov_token=null){
		this.num_words = num_words;
		this.filters = filters;
		this.lower = lower;
		this.split = split;
		this.char_level = char_level;
		this.oov_token = oov_token;
	}
	from_json(json){
		this.tokenizer = JSON.parse("{}");
		for(var i = 0; i < this.num_words; i++)
			this.tokenizer[i] = json[i];
	}
	text_to_sequence(text){
		var word_tokens = [];

		var word_raw = text.split(this.split);

		for(var word in word_raw){
			var token = this.tokenizer[word];
			if(token){
				word_tokens.push(token);
			}else if(this.oov_token){
				word_tokens.push(this.oov_token);
			}
		}
		return word_tokens;
	}
	pad_sequence(word_tokens, max_length, pad_val=0){
		var token_len = word_tokens.length;
		if(token_len < max_length){
			for(var i = 0; i < (max_length - token_len); i++){
				word_tokens.push(pad_val);
			}
		}
		word_tokens = word_tokens.slice(0, max_length);
		return word_tokens;
	}
}
export default Tokenizer
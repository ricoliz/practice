# -*- coding: utf-8 -*-
# http://qiita.com/tk-ota@github/private/933778b3be6c23d98c6d



# p "Hello Ruby"
# puts "Hello Ruby"
# name = "tomoaki"
# puts "My name is #{name}"

# if文

# if
# flag = true
# if flag
#  p 'Success!'
# end
#

# flag = nil
# if flag.nil?
#  p 'Not Nil!'
# end
#
# p 'Not Nil!' if flag.nil?


# 文字列置換

# gsub
# str = "Yamada Taro"
# p str.gsub("Yamada", "Tanaka")
# p str
# びっくりマークつけると、破壊メソッド
# 再代入するときに使う。
# p str.gsub!("Yamada", "Tanaka")
# p str
# chomp
# strip

# Array
system = ['PHP', 'Ruby', 'Python', 'Java']
# p system[0]
# system << 'Scala'
# system.push('Scala')
# 範囲で取得できる
# p system[1..2]



# Hash(= object)
preprocessor = {
  :html => 'Jade',
  :css => 'Sass',
  :js => 'CoffeeScript'
}
# p preprocessor[:html]



# Each
# system.each do |e|
#  p e
# end
#system.each{|e| p e }
#
# key valueの略
# preprocessor.each do |k, v|
#  p k, v
# end
# preprocessor.each{|k, v| p k, v}


# jsでいうfunction
# function square(x){
	# return x* x;
# }

# 勝手にreturn入れてくれる。別に自分でいれてもいい
# Def
def square(x)
 x * x
end
p square(3)

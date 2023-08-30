import { Card, Box, CardFooter, Heading, Text, Image, Flex } from '@chakra-ui/react';
import React from 'react'
import { MyPokemon } from '../../interfaces/myPokemonData';
import { colours } from '../../utils/pokemonTypeColors';
import { Type } from '../../interfaces/pokemonData';
import { useNavigate } from 'react-router-dom';

export const MyPokemonList = () => {
  const keys = Object.keys(localStorage)
  const datas = []
  const navigate = useNavigate();
  for (let i = 0; i < keys.length; i++) {
    const pokemons = localStorage.getItem(keys[i]);
    if(pokemons?.includes('pokemon')){
      datas.push(JSON.parse(pokemons as string))
    }
  }
  const handlePokemonDetails = (nickname: string) => {
    navigate(`show/${nickname}`);
  }
  return (
    <>
      {datas.length == 0 ?
        <Text>Empty.... Go Cacth some pokemon First</Text>
        :

        <Flex flexWrap='wrap' justifyContent='center'>
          {datas?.map((value: MyPokemon, index) => (
            <Card
              onClick={() => handlePokemonDetails(value.nickname)}
              cursor="pointer"
              key={index} flexBasis='30%' height='48' margin='1.5' flexDirection='row-reverse' bgColor={colours[value.pokemon.types[0].type.name]} borderRadius='2xl' _hover={{ bgGradient: 'linear(45deg, blackAlpha.300, transparent)', top: '-0.5rem', transform: 'scale(1.08)', zIndex: '99', transition: 'linear', transitionDuration: '0.5s', boxShadow: `0px 0px 40px 0px ${colours[value.pokemon.types[0].type.name]}` }}>
              <Box>
                <Box fontSize='2xl' textColor='whiteAlpha.500' textAlign='end' marginX='5' paddingTop='4' flexDirection='row' display='flex' justifyContent='space-between'>
                  <Text>{value.nickname}</Text>
                  <Text>#{value.pokemon.id}</Text>
                </Box>
                <Image alignSelf='center' width='full' borderRadius='2xl' marginRight='16' marginTop='-6' src={value.pokemon.sprites.front_default} />
              </Box>
              <CardFooter marginRight='auto' flexDirection='column'>
                <Heading size='lg' textTransform='capitalize' margin='2' textColor='whiteAlpha.800'>
                  {value.pokemon.name}
                </Heading>
                {value?.pokemon.types.map((type: Type, index) => (
                  <Text marginLeft='1' width='max-content' paddingX='3' paddingY='1' margin='1' borderRadius='lg' textTransform='capitalize' bgColor='whiteAlpha.600' fontWeight='bold' textColor={colours[type.type.name]} key={index}>{type.type.name}</Text>
                ))}
              </CardFooter>
            </Card>
          ))}
        </Flex>
      }
    </>
  )
}

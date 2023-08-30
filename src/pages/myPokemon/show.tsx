import { Flex, Card, Box, Heading, Progress, Button, Text, Image } from '@chakra-ui/react'
import React from 'react'
import { useParams } from 'react-router-dom'
import { colours } from '../../utils/pokemonTypeColors'
import { MyPokemon } from '../../interfaces/myPokemonData'
import { Stat, Type, Ability } from '../../interfaces/pokemonData'
import { useNavigate } from 'react-router-dom';

export const MyPokemonDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const pokemon = JSON.parse(localStorage.getItem(id as string) as string)

  const handleRelease = () => {
    localStorage.removeItem(id as string)
    navigate(`/myPokemon`);
  }
  return (
    <Flex justifyContent='center' wrap='wrap' gap='16'>
      <Card border={`10px solid ${colours[pokemon?.pokemon.types[0].type.name as string]}`} borderRadius='2xl' height='90vh'>
        <Box
          bgColor={colours[pokemon?.pokemon.types[0].type.name as string]}
          width='30vw'
          height='48'
          textAlign='end'
        >
          <Text margin='4' fontSize='2xl' textColor='whiteAlpha.600'>
            #{pokemon?.pokemon.id}
          </Text>
        </Box>
        <Box alignSelf='center' marginTop='-40'>
          <Heading textTransform='capitalize' textAlign='center' fontFamily='sans-serif'>
            {pokemon?.pokemon.name}
          </Heading>
          <Box display='flex' justifyContent='center' marginTop='5'>
            {pokemon?.pokemon.types.map((type: Type, index: number) => (
              <Text marginLeft='1' width='max-content' paddingX='3' paddingY='1' margin='1' borderRadius='lg' textTransform='capitalize' bgColor='whiteAlpha.600' fontWeight='bold' textColor={colours[type.type.name]} key={index}>{type.type.name}</Text>
            ))}
          </Box>
          <Image
            src={pokemon?.pokemon.sprites.front_default}
            width='10vw'
            marginTop='-10'
          />
        </Box>
        <Text textAlign='center' marginBottom='-2' borderTop={`solid 2px ${colours[pokemon?.pokemon.types[0].type.name as string]}`}>
          {pokemon.nickname}
        </Text>
        <Text textAlign='center' fontSize='xl' fontWeight='bold'>Move</Text>
            <Box display='flex' flexDirection='row' justifyContent='center' textAlign='center'>
              {pokemon?.pokemon.abilities.map((abi: Ability, index:number) => (
                <Text key={index} marginX='8' marginY='4' padding='4' bgColor={colours[pokemon?.pokemon.types[0].type.name as string]} borderRadius='2xl'>
                  {abi.ability.name}
                </Text>
              ))}
            </Box>
            <Box marginTop='16'>
              <Text textAlign='center'>Other Image</Text>
              <Box display='flex' flexDirection='row' justifyContent='center'>
                <Image w='5vw' src={pokemon?.pokemon.sprites.other.dream_world.front_default}/>
                <Image w='5vw' src={pokemon?.pokemon.sprites.other.home.front_default}/>
                <Image w='5vw' src={pokemon?.pokemon.sprites.other['official-artwork'].front_default}/>
              </Box>
            </Box>
      </Card>
      <Card border={`10px solid ${colours[pokemon?.pokemon.types[0].type.name as string]}`} borderRadius='2xl' width='30vw' height='90vh'>
        <Box margin='2'>
          <Heading textAlign='center' fontFamily='sans-serif'>
            Base Stat
          </Heading>
          {pokemon?.pokemon.stats.map((stat: Stat, index: number) => (
            <Box key={index} display='grid' rowGap='4'>
              <Text textTransform='capitalize'>
                {stat.stat.name}
              </Text>
              <Progress colorScheme='messenger' value={stat.base_stat * 0.5} />
            </Box>
          ))}
        </Box>
        <Box margin='36' alignSelf='center' display='flex' justifyContent='center' cursor='pointer'>
          <Button alignSelf='center' w='fit-content' color='red.700' onClick={handleRelease}>
            Delete Pokemon
          </Button>
        </Box>
      </Card>
    </Flex>
  )
}

import { useOne, useCreate } from '@refinedev/core'
import React, { useState } from 'react'
import { Ability, Other, Pokemon, Stat, Type } from '../../interfaces/pokemonData'
import { useParams } from 'react-router-dom'
import { Box, Card, Flex, Skeleton, Text, Image, Heading, Button, Progress, Spinner, Modal, useDisclosure, ModalOverlay, Input, CloseButton } from '@chakra-ui/react'
import { colours } from '../../utils/pokemonTypeColors';
import pokeBall from '../../assets/Images/pokeBallColor.png'

export const PokemonDetails = () => {
  const { id } = useParams()
  const [pokemonData, setPokemon] = useState('null')
  const [catching, setCatcing] = useState(false)
  const [catched, setCatched] = useState(false)
  const [nickname, setNickname] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data, isFetched } = useOne<Pokemon>({
    resource: 'pokemon',
    id,
  })
  const pokemon = data?.data;
  const { mutate } = useCreate();
  const catchPokemon = (pokemon: Pokemon) => {
    mutate({
      resource: nickname,
      values: {
        pokemon, nickname
      },
    });
  }

  const loadCatchPokemon = () => {
    onOpen()
    setCatcing(true)
    setCatched(false)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const number = Math.random();
        if (number > 0.5) {
          resolve(setPokemon(pokemon?.name as string));
          setCatched(true)
        } else {
          reject(new Error(`${pokemon?.name} run!!!!`))
        }
        setCatcing(false)
      }, 2000)
    })
  }

  const handleCatchPokemon = () => {
    catchPokemon(pokemon as Pokemon)
    onClose()
  }
  return (
    <Box style={{ fontFamily: 'Press Start 2P' }}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay textAlign='center'>
          <Box marginTop='40vh'>
            {catching ?
              <Spinner size='xl' />
              :
              !catched ? 
              <Box borderRadius='2xl' bgColor={colours[pokemon?.types[0].type.name as string]} w='50%' marginLeft='25vw' paddingBottom='8' display='flex' flexDirection='column' gap='2'>
              <CloseButton onClick={onClose} alignSelf='end' paddingRight='4'/>
              <Text textTransform='capitalize'>
                {pokemon?.name} run !!!
              </Text>
            </Box>
              :
              <Box borderRadius='2xl' bgColor={colours[pokemon?.types[0].type.name as string]} w='50%' marginLeft='25vw' paddingBottom='8' display='flex' flexDirection='column' gap='2'>
                <CloseButton onClick={onClose} alignSelf='end' paddingRight='4'/>
                <Text>
                  Gocha !!!
                </Text>
                <Box display='flex' flexDirection='row' gap='4' justifyContent='center'>
                  <Text alignSelf='center'>
                    Nick Name :
                  </Text>
                  <Input  w='70%' type='text' value={nickname} onChange={(e)=> setNickname(e.target.value)}/>
                </Box>
                <Button width='50%' alignSelf='center' onClick={()=> handleCatchPokemon()}>Save</Button>
              </Box>
            }
          </Box>
        </ModalOverlay>
      </Modal>
      <Skeleton isLoaded={isFetched}>
        <Flex justifyContent='center' wrap='wrap' gap='16'>
          <Card border={`10px solid ${colours[pokemon?.types[0].type.name as string]}`} borderRadius='2xl' height='90vh'>
            <Box
              bgColor={colours[pokemon?.types[0].type.name as string]}
              width='30vw'
              height='48'
              textAlign='end'
            >
              <Text margin='4' fontSize='2xl' textColor='whiteAlpha.600'>
                #{pokemon?.id}
              </Text>
            </Box>
            <Box alignSelf='center' marginTop='-40'>
              <Heading textTransform='capitalize' textAlign='center' fontFamily='sans-serif'>
                {pokemon?.name}
              </Heading>
              <Box display='flex' justifyContent='center' marginTop='5'>
                {pokemon?.types.map((type: Type, index) => (
                  <Text marginLeft='1' width='max-content' paddingX='3' paddingY='1' margin='1' borderRadius='lg' textTransform='capitalize' bgColor='whiteAlpha.600' fontWeight='bold' textColor={colours[type.type.name]} key={index}>{type.type.name}</Text>
                ))}
              </Box>
              <Image
                src={pokemon?.sprites.front_default}
                width='10vw'
                marginTop='-10'
              />
            </Box>
            <Text textAlign='center' fontSize='xl' fontWeight='bold'>Move</Text>
            <Box display='flex' flexDirection='row' justifyContent='center' textAlign='center'>
              {pokemon?.abilities.map((abi: Ability, index:number) => (
                <Text key={index} marginX='8' marginY='4' padding='4' bgColor={colours[pokemon?.types[0].type.name as string]} borderRadius='2xl'>
                  {abi.ability.name}
                </Text>
              ))}
            </Box>
            <Box marginTop='16'>
              <Text textAlign='center'>Other Image</Text>
              <Box display='flex' flexDirection='row' justifyContent='center'>
                <Image w='5vw' src={pokemon?.sprites.other.dream_world.front_default}/>
                <Image w='5vw' src={pokemon?.sprites.other.home.front_default}/>
                <Image w='5vw' src={pokemon?.sprites.other['official-artwork'].front_default}/>
              </Box>
            </Box>
          </Card>
          <Card border={`10px solid ${colours[pokemon?.types[0].type.name as string]}`} borderRadius='2xl' width='30vw' height='90vh'>
            <Box margin='2'>
              <Heading textAlign='center' fontFamily='sans-serif'>
                Base Stat
              </Heading>
              {pokemon?.stats.map((stat: Stat, index) => (
                <Box key={index} display='grid' rowGap='4'>
                  <Text textTransform='capitalize'>
                    {stat.stat.name}
                  </Text>
                  <Progress colorScheme='messenger' value={stat.base_stat * 0.5} />
                </Box>
              ))}
            </Box>
            <Box margin='36' alignSelf='center' display='flex' justifyContent='center' cursor='pointer' onClick={loadCatchPokemon}>
              <Image src={pokeBall} w='20' marginRight='-6' zIndex='1' />
              <Button alignSelf='center' w='24'>
                Catch
              </Button>
            </Box>
          </Card>
        </Flex>
      </Skeleton>
    </Box>
  )
}

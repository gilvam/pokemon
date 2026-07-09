# /context

⎿  Context Usage                                                          
⛀ ⛀ ⛀ ⛀ ⛁   Sonnet 5                                                   
⛁ ⛁ ⛁ ⛁ ⛁   claude-sonnet-5                                            
⛶ ⛶ ⛶ ⛶ ⛶   278.5k/967k tokens (29%)                                   
⛶ ⛶ ⛶ ⛶ ⛶                                                              
⛶ ⛶ ⛶ ⛶ ⛝   Estimated usage by category                                
              ⛁ System prompt: 9.4k tokens (1.0%)                        
              ⛁ System tools: 21.8k tokens (2.3%)                        
              ⛁ Memory files: 207 tokens (0.0%)                          
              ⛁ Skills: 1.9k tokens (0.2%)                               
              ⛁ Messages: 245.2k tokens (25.4%)                          
              ⛶ Free space: 655.4k (67.8%)                               
              ⛝ Autocompact buffer: 33k tokens (3.4%)

     Auto-compact window: 967k tokens                                       
                                                                            
     MCP tools · /mcp                                                       
     └ 1 tool · 0 tokens                                                    
                                                                            
     Memory files · /memory                                                 
     └ 1 file · 207 tokens                                                  
                                                                            
     Skills · /skills                                                       
     └ 15 skills · 1.9k tokens                                              
                                                                            
     /context all to expand


# /usage

Session

Total cost:            $13.70                                         
Total duration (API):  32m 4s                                         
Total duration (wall): 2h 34m 25s                                     
Total code changes:    1786 lines added, 390 lines removed            
Usage by model:                                                       
claude-haiku-4-5:  623 input, 21 output, 0 cache read, 0 cache    
write ($0.0007)                                                       
claude-sonnet-5:  15.9k input, 153.5k output, 25.7m cache read,  
608.1k cache write ($13.70)

Current session                                                       
█████████████████████████▌                         51% used           
Resets 2:20pm (America/Sao_Paulo)

Current week (all models)                                             
███                                                6% used            
Resets Jul 14, 8am (America/Sao_Paulo)

Current week (Fable)                                                  
0% used

What's contributing to your limits usage?                             
Approximate, based on local sessions on this machine — does not       
include other devices or claude.ai

Last 24h · these are independent characteristics of your usage, not a
breakdown

49% of your usage was at >150k context                                
Longer sessions are more expensive even when cached. /compact mid-tas
/clear when switching to new tasks.

13% of your usage came from subagent-heavy sessions                   
Each subagent runs its own requests. Be deliberate about spawning the
and consider configuring a cheaper model for simpler subagents.

19% of your usage came from /run                                      
Heavy skills can be scoped down or run with a cheaper model via skill
frontmatter.

Skills                  % of usage                                    
/run                           19%

Subagents               % of usage                                    
Explore                         5%
